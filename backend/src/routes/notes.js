const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { authenticate } = require('../middleware/auth');

// Apply auth middleware
router.use(authenticate);

// GET /api/leads/:leadId/notes — Get all notes for a lead
router.get('/:leadId/notes', async (req, res) => {
  try {
    const { leadId } = req.params;

    // Verify lead exists
    const leadDoc = await db.collection('leads').doc(leadId).get();
    if (!leadDoc.exists) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    const snapshot = await db
      .collection('leads')
      .doc(leadId)
      .collection('notes')
      .orderBy('createdAt', 'desc')
      .get();

    const notes = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      notes.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
      });
    });

    res.json(notes);
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// POST /api/leads/:leadId/notes — Add a note to a lead
router.post('/:leadId/notes', async (req, res) => {
  try {
    const { leadId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Note content is required' });
    }

    // Verify lead exists
    const leadDoc = await db.collection('leads').doc(leadId).get();
    if (!leadDoc.exists) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    const noteData = {
      content: content.trim(),
      createdBy: req.user.email,
      createdAt: new Date(),
    };

    const docRef = await db
      .collection('leads')
      .doc(leadId)
      .collection('notes')
      .add(noteData);

    // Also update the lead's updatedAt timestamp
    await db.collection('leads').doc(leadId).update({
      updatedAt: new Date(),
    });

    res.status(201).json({
      id: docRef.id,
      ...noteData,
    });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

module.exports = router;
