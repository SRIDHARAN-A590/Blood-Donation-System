import express from 'express';
import cors from 'cors';
import {
  createDonor,
  getDonors,
  getDonorById,
  updateDonor,
  deleteDonor,
  createRequest,
  getRequests,
  getRequestById,
  updateRequest,
  pledgeRequest,
  deleteRequest
} from './crud.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'NeoBlood MongoDB API', timestamp: new Date().toISOString() });
});

/* ==========================================================================
   DONORS CRUD ENDPOINTS
   ========================================================================== */

// [CREATE] Register a new donor
app.post('/api/donors', async (req, res) => {
  try {
    const donor = await createDonor(req.body);
    res.status(201).json({ success: true, data: donor });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// [READ] Get donors (with query filters: ?bloodGroup=O+&city=Madurai&isAvailable=true)
app.get('/api/donors', async (req, res) => {
  try {
    const donors = await getDonors(req.query);
    res.json({ success: true, count: donors.length, data: donors });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// [READ] Get donor by id
app.get('/api/donors/:id', async (req, res) => {
  try {
    const donor = await getDonorById(req.params.id);
    if (!donor) return res.status(404).json({ success: false, message: 'Donor not found' });
    res.json({ success: true, data: donor });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// [UPDATE] Update donor
app.put('/api/donors/:id', async (req, res) => {
  try {
    const updated = await updateDonor(req.params.id, req.body);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// [DELETE] Remove donor
app.delete('/api/donors/:id', async (req, res) => {
  try {
    const result = await deleteDonor(req.params.id);
    res.json({ success: result.success, deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* ==========================================================================
   BLOOD REQUESTS CRUD ENDPOINTS
   ========================================================================== */

// [CREATE] Post emergency blood request
app.post('/api/requests', async (req, res) => {
  try {
    const newReq = await createRequest(req.body);
    res.status(201).json({ success: true, data: newReq });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// [READ] Get blood requests (with filters: ?city=Madurai&bloodGroup=O+&status=OPEN)
app.get('/api/requests', async (req, res) => {
  try {
    const requests = await getRequests(req.query);
    res.json({ success: true, count: requests.length, data: requests });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// [READ] Get request by id
app.get('/api/requests/:id', async (req, res) => {
  try {
    const reqItem = await getRequestById(req.params.id);
    if (!reqItem) return res.status(404).json({ success: false, message: 'Request not found' });
    res.json({ success: true, data: reqItem });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// [UPDATE] Update request
app.put('/api/requests/:id', async (req, res) => {
  try {
    const updated = await updateRequest(req.params.id, req.body);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// [UPDATE - SPECIALIZED] Pledge donation to request
app.post('/api/requests/:id/pledge', async (req, res) => {
  try {
    const { donorId, donorName } = req.body;
    const pledged = await pledgeRequest(req.params.id, donorId, donorName);
    res.json({ success: true, data: pledged });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// [DELETE] Remove request
app.delete('/api/requests/:id', async (req, res) => {
  try {
    const result = await deleteRequest(req.params.id);
    res.json({ success: result.success, deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 NeoBlood MongoDB API server running on http://localhost:${PORT}`);
});
