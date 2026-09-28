import { connectToMongoDB, client } from './db.js';
import { ObjectId } from 'mongodb';

// Helper to convert string or ObjectId
function toMongoId(id) {
  if (typeof id === 'string' && ObjectId.isValid(id) && id.length === 24) {
    return new ObjectId(id);
  }
  return id;
}

/* ==========================================================================
   DONORS CRUD OPERATIONS
   ========================================================================== */

/**
 * [CREATE] Create a new donor profile in MongoDB
 */
export async function createDonor(donorData) {
  const db = await connectToMongoDB();
  const donor = {
    ...donorData,
    isAvailable: donorData.isAvailable ?? true,
    role: 'donor',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const result = await db.collection('donors').insertOne(donor);
  return { _id: result.insertedId, ...donor };
}

/**
 * [READ] Get all donors with optional filtering (bloodGroup, state, city, availability)
 */
export async function getDonors(filter = {}) {
  const db = await connectToMongoDB();
  const query = {};

  if (filter.bloodGroup) query.bloodGroup = filter.bloodGroup;
  if (filter.state) query.state = new RegExp(`^${filter.state}$`, 'i');
  if (filter.city) query.city = new RegExp(`^${filter.city}$`, 'i');
  if (filter.isAvailable !== undefined) {
    query.isAvailable = filter.isAvailable === true || filter.isAvailable === 'true';
  }

  return await db.collection('donors').find(query).sort({ createdAt: -1 }).toArray();
}

/**
 * [READ] Get single donor by id
 */
export async function getDonorById(id) {
  const db = await connectToMongoDB();
  const _id = toMongoId(id);
  return await db.collection('donors').findOne({
    $or: [{ _id }, { uid: id }]
  });
}

/**
 * [UPDATE] Update donor profile (e.g. toggle availability, update phone, location)
 */
export async function updateDonor(id, updateData) {
  const db = await connectToMongoDB();
  const _id = toMongoId(id);

  const updates = {
    ...updateData,
    updatedAt: new Date().toISOString()
  };

  const result = await db.collection('donors').findOneAndUpdate(
    { $or: [{ _id }, { uid: id }] },
    { $set: updates },
    { returnDocument: 'after' }
  );

  return result;
}

/**
 * [DELETE] Remove donor record
 */
export async function deleteDonor(id) {
  const db = await connectToMongoDB();
  const _id = toMongoId(id);

  const result = await db.collection('donors').deleteOne({
    $or: [{ _id }, { uid: id }]
  });

  return { success: result.deletedCount > 0, deletedCount: result.deletedCount };
}

/* ==========================================================================
   BLOOD REQUESTS CRUD OPERATIONS
   ========================================================================== */

/**
 * [CREATE] Post a new blood request to MongoDB
 */
export async function createRequest(requestData) {
  const db = await connectToMongoDB();
  const request = {
    ...requestData,
    unitsRequired: parseInt(requestData.unitsRequired) || 1,
    status: requestData.status || 'OPEN',
    emergencyLevel: requestData.emergencyLevel || 'NORMAL',
    acceptedDonorId: null,
    acceptedDonorName: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const result = await db.collection('requests').insertOne(request);
  return { _id: result.insertedId, ...request };
}

/**
 * [READ] Get blood requests with optional filters
 */
export async function getRequests(filter = {}) {
  const db = await connectToMongoDB();
  const query = {};

  if (filter.status) query.status = filter.status;
  if (filter.bloodGroup) query.bloodGroup = filter.bloodGroup;
  if (filter.state) query.state = new RegExp(`^${filter.state}$`, 'i');
  if (filter.city) query.city = new RegExp(`^${filter.city}$`, 'i');
  if (filter.emergencyLevel) query.emergencyLevel = filter.emergencyLevel;

  return await db.collection('requests').find(query).sort({ createdAt: -1 }).toArray();
}

/**
 * [READ] Get single blood request by id
 */
export async function getRequestById(id) {
  const db = await connectToMongoDB();
  const _id = toMongoId(id);
  return await db.collection('requests').findOne({
    $or: [{ _id }, { requestId: id }]
  });
}

/**
 * [UPDATE] Update request details (units, status, details)
 */
export async function updateRequest(id, updateData) {
  const db = await connectToMongoDB();
  const _id = toMongoId(id);

  const updates = {
    ...updateData,
    updatedAt: new Date().toISOString()
  };

  const result = await db.collection('requests').findOneAndUpdate(
    { $or: [{ _id }, { requestId: id }] },
    { $set: updates },
    { returnDocument: 'after' }
  );

  return result;
}

/**
 * [UPDATE - SPECIALIZED] Pledge donation to request
 */
export async function pledgeRequest(requestId, donorId, donorName) {
  return await updateRequest(requestId, {
    acceptedDonorId: donorId,
    acceptedDonorName: donorName,
    status: 'PLEDGED'
  });
}

/**
 * [DELETE] Remove or cancel a blood request
 */
export async function deleteRequest(id) {
  const db = await connectToMongoDB();
  const _id = toMongoId(id);

  const result = await db.collection('requests').deleteOne({
    $or: [{ _id }, { requestId: id }]
  });

  return { success: result.deletedCount > 0, deletedCount: result.deletedCount };
}
