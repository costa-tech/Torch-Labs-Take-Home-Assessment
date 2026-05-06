const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { authenticate } = require('../middleware/auth');

// Apply auth middleware
router.use(authenticate);

// GET /api/dashboard/stats — Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const snapshot = await db.collection('leads').get();
    const leads = [];

    snapshot.forEach((doc) => {
      leads.push(doc.data());
    });

    const totalLeads = leads.length;
    const newLeads = leads.filter((l) => l.status === 'New').length;
    const contactedLeads = leads.filter((l) => l.status === 'Contacted').length;
    const qualifiedLeads = leads.filter((l) => l.status === 'Qualified').length;
    const proposalSentLeads = leads.filter((l) => l.status === 'Proposal Sent').length;
    const wonLeads = leads.filter((l) => l.status === 'Won').length;
    const lostLeads = leads.filter((l) => l.status === 'Lost').length;

    const totalDealValue = leads.reduce((sum, l) => sum + (Number(l.dealValue) || 0), 0);
    const wonDealValue = leads
      .filter((l) => l.status === 'Won')
      .reduce((sum, l) => sum + (Number(l.dealValue) || 0), 0);

    // Lead sources breakdown
    const sourceBreakdown = {};
    leads.forEach((l) => {
      const src = l.source || 'Unknown';
      sourceBreakdown[src] = (sourceBreakdown[src] || 0) + 1;
    });

    // Recent leads (last 5)
    const recentLeads = leads
      .sort((a, b) => {
        const aDate = a.createdAt?.toDate?.() || new Date(a.createdAt);
        const bDate = b.createdAt?.toDate?.() || new Date(b.createdAt);
        return bDate - aDate;
      })
      .slice(0, 5)
      .map((l) => ({
        name: l.name,
        company: l.company,
        status: l.status,
        dealValue: l.dealValue,
        createdAt: l.createdAt?.toDate?.() || l.createdAt,
      }));

    // Pipeline data for chart
    const pipeline = [
      { stage: 'New', count: newLeads, color: '#6366f1' },
      { stage: 'Contacted', count: contactedLeads, color: '#8b5cf6' },
      { stage: 'Qualified', count: qualifiedLeads, color: '#a855f7' },
      { stage: 'Proposal Sent', count: proposalSentLeads, color: '#f59e0b' },
      { stage: 'Won', count: wonLeads, color: '#10b981' },
      { stage: 'Lost', count: lostLeads, color: '#ef4444' },
    ];

    // Conversion rate
    const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : 0;

    res.json({
      totalLeads,
      newLeads,
      contactedLeads,
      qualifiedLeads,
      proposalSentLeads,
      wonLeads,
      lostLeads,
      totalDealValue,
      wonDealValue,
      conversionRate: Number(conversionRate),
      sourceBreakdown,
      recentLeads,
      pipeline,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

module.exports = router;
