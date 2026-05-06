const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { authenticate } = require('../middleware/auth');

const leadsCollection = db.collection('leads');

// Apply auth middleware to all lead routes
router.use(authenticate);

// GET /api/leads — List all leads with optional filters
router.get('/', async (req, res) => {
  try {
    const { status, source, assignedTo, search } = req.query;
    
    // Fetch all leads (Firestore doesn't require composite indices for this)
    const snapshot = await leadsCollection.get();
    let leads = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      leads.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
      });
    });

    // In-memory sorting (descending by createdAt)
    leads.sort((a, b) => b.createdAt - a.createdAt);

    // Apply filters
    if (status) {
      leads = leads.filter(lead => lead.status === status);
    }
    if (source) {
      leads = leads.filter(lead => lead.source === source);
    }
    if (assignedTo) {
      leads = leads.filter(lead => lead.assignedTo === assignedTo);
    }

    // Apply text search
    if (search) {
      const searchLower = search.toLowerCase();
      leads = leads.filter(
        (lead) =>
          lead.name?.toLowerCase().includes(searchLower) ||
          lead.company?.toLowerCase().includes(searchLower) ||
          lead.email?.toLowerCase().includes(searchLower)
      );
    }

    res.json(leads);
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

// GET /api/leads/:id — Get a single lead
router.get('/:id', async (req, res) => {
  try {
    const doc = await leadsCollection.doc(req.params.id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    const data = doc.data();
    res.json({
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() || data.createdAt,
      updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
    });
  } catch (error) {
    console.error('Get lead error:', error);
    res.status(500).json({ error: 'Failed to fetch lead' });
  }
});

// POST /api/leads — Create a new lead
router.post('/', async (req, res) => {
  try {
    const { name, company, email, phone, source, assignedTo, status, dealValue } = req.body;

    if (!name || !company || !email) {
      return res.status(400).json({ error: 'Name, company, and email are required' });
    }

    const now = new Date();
    const leadData = {
      name,
      company,
      email,
      phone: phone || '',
      source: source || 'Website',
      assignedTo: assignedTo || '',
      status: status || 'New',
      dealValue: Number(dealValue) || 0,
      createdAt: now,
      updatedAt: now,
      createdBy: req.user.email,
    };

    const docRef = await leadsCollection.add(leadData);

    res.status(201).json({
      id: docRef.id,
      ...leadData,
    });
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({ error: 'Failed to create lead' });
  }
});

// PUT /api/leads/:id — Update a lead
router.put('/:id', async (req, res) => {
  try {
    const docRef = leadsCollection.doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    const { name, company, email, phone, source, assignedTo, status, dealValue } = req.body;

    const updateData = {
      ...(name !== undefined && { name }),
      ...(company !== undefined && { company }),
      ...(email !== undefined && { email }),
      ...(phone !== undefined && { phone }),
      ...(source !== undefined && { source }),
      ...(assignedTo !== undefined && { assignedTo }),
      ...(status !== undefined && { status }),
      ...(dealValue !== undefined && { dealValue: Number(dealValue) }),
      updatedAt: new Date(),
    };

    await docRef.update(updateData);

    const updated = await docRef.get();
    const data = updated.data();

    res.json({
      id: updated.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() || data.createdAt,
      updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
    });
  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({ error: 'Failed to update lead' });
  }
});

// PATCH /api/leads/:id/status — Update lead status only
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const docRef = leadsCollection.doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    await docRef.update({
      status,
      updatedAt: new Date(),
    });

    const updated = await docRef.get();
    const data = updated.data();

    res.json({
      id: updated.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() || data.createdAt,
      updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Failed to update lead status' });
  }
});

// DELETE /api/leads/:id — Delete a lead
router.delete('/:id', async (req, res) => {
  try {
    const docRef = leadsCollection.doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    // Also delete all notes in the subcollection
    const notesSnapshot = await docRef.collection('notes').get();
    const batch = db.batch();
    notesSnapshot.forEach((noteDoc) => {
      batch.delete(noteDoc.ref);
    });
    batch.delete(docRef);
    await batch.commit();

    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({ error: 'Failed to delete lead' });
  }
});

module.exports = router;
