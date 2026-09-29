import { MongoClient } from 'mongodb';
import fs from 'node:fs';
import path from 'node:path';
import dns from 'node:dns';
import { localStore } from './localMongo.js';

// Fix for Windows DNS resolution with MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

function getMongoUri() {
  if (process.env.MONGODB_URI) return process.env.MONGODB_URI;

  const envFiles = ['.env', 'atlas-credentials.env', '.env.local'];
  for (const file of envFiles) {
    const fullPath = path.resolve(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const match = content.match(/MONGODB_URI=["']?([^"'\r\n]+)["']?/);
      if (match && match[1]) {
        return match[1];
      }
    }
  }

  return "mongodb://sridharanak032006_db_user:Q90RkAlqLABCBs0d@ac-lr0tbas-shard-00-00.4pdpews.mongodb.net:27017,ac-lr0tbas-shard-00-01.4pdpews.mongodb.net:27017,ac-lr0tbas-shard-00-02.4pdpews.mongodb.net:27017/?ssl=true&replicaSet=atlas-99i76r-shard-0&authSource=admin&appName=NeoBlood";
}

const uri = getMongoUri();
export let client = null;
let activeDb = null;
let isConnectedToAtlas = false;

export async function connectToMongoDB() {
  if (activeDb) {
    return activeDb;
  }

  const dbName = process.env.MONGODB_DB_NAME || "neoblood";

  try {
    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000
    });
    await client.connect();
    activeDb = client.db(dbName);
    isConnectedToAtlas = true;
    console.log(`✅ Successfully connected to MongoDB Atlas (database: ${dbName})!`);
    return activeDb;
  } catch (err) {
    console.warn(`⚠️ MongoDB Atlas direct connection notice: ${err.message}`);
    console.log(`ℹ️ To whitelist your IP in Atlas: go to cloud.mongodb.com -> Network Access -> Add IP Address: 0.0.0.0/0 (or current IP: 110.224.90.113).`);
    console.log(`🚀 Using MongoDB-compatible persistent data store (server/data/mongodb_store.json) for 100% CRUD operations!`);
    activeDb = localStore;
    return activeDb;
  }
}

export function getDatabaseStatus() {
  return {
    connected: true,
    isAtlas: isConnectedToAtlas,
    source: isConnectedToAtlas ? 'MongoDB Atlas' : 'Local Persistent MongoDB Store'
  };
}

export async function disconnectFromMongoDB() {
  if (client) {
    try {
      await client.close();
      activeDb = null;
      isConnectedToAtlas = false;
      console.log("Disconnected from MongoDB.");
    } catch (e) {}
  }
}

// Direct execution test
if (process.argv[1]?.endsWith('db.js')) {
  (async () => {
    try {
      const db = await connectToMongoDB();
      console.log("Database ready:", !!db);
      await disconnectFromMongoDB();
    } catch (e) {
      process.exit(1);
    }
  })();
}

