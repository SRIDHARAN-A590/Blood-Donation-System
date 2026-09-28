import { MongoClient } from 'mongodb';
import fs from 'node:fs';
import path from 'node:path';
import dns from 'node:dns';

// Fix for Windows DNS resolution with MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

// Auto-load MONGODB_URI from .env or atlas-credentials.env if not in process.env
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

  // Fallback direct replica set URI
  return "mongodb://sridharanak032006_db_user:Q90RkAlqLABCBs0d@ac-lr0tbas-shard-00-00.4pdpews.mongodb.net:27017,ac-lr0tbas-shard-00-01.4pdpews.mongodb.net:27017,ac-lr0tbas-shard-00-02.4pdpews.mongodb.net:27017/?ssl=true&replicaSet=atlas-99i76r-shard-0&authSource=admin&appName=NeoBlood";
}

const uri = getMongoUri();
export const client = new MongoClient(uri);

export async function connectToMongoDB() {
  try {
    await client.connect();
    const dbName = process.env.MONGODB_DB_NAME || "newbank";
    console.log(`You successfully connected to MongoDB Atlas (NeoBlood cluster, db: ${dbName})!`);
    const db = client.db(dbName);
    const ping = await db.command({ ping: 1 });
    console.log("Ping result:", ping);
    return db;
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
    throw err;
  }
}

export async function disconnectFromMongoDB() {
  await client.close();
  console.log("Disconnected from MongoDB.");
}

// Direct execution test
if (process.argv[1]?.endsWith('db.js')) {
  (async () => {
    try {
      await connectToMongoDB();
      await disconnectFromMongoDB();
    } catch (e) {
      process.exit(1);
    }
  })();
}
