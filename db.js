import mongoose from 'mongoose';
import { Vaccine } from '../models/Vaccine.js';
import { UIP_INDIA_VACCINES } from './uipVaccinesData.js';

let isMongoConnected = false;

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/evaccine_db';

  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000 // Quick timeout if no server
    });

    isMongoConnected = true;
    console.log(`✅ [MongoDB] Connected successfully to host: ${conn.connection.host} / database: ${conn.connection.name}`);

    // Auto-seed UIP vaccines if empty
    await seedUIPVaccines();
    return true;
  } catch (error) {
    isMongoConnected = false;
    console.warn(`⚠️ [MongoDB] Connection to '${uri}' could not be established (${error.message}).`);
    console.info(`💡 Note for Developer/Student: To connect live MongoDB, add MONGODB_URI=mongodb+srv://... to your .env file or launch your local MongoDB service.`);
    return false;
  }
}

export async function seedUIPVaccines() {
  try {
    const count = await Vaccine.countDocuments();
    if (count === 0) {
      console.log('🌱 [MongoDB] Seeding official Universal Immunization Programme (UIP India) vaccines...');
      await Vaccine.insertMany(UIP_INDIA_VACCINES);
      console.log(`✅ [MongoDB] Successfully seeded ${UIP_INDIA_VACCINES.length} official UIP vaccines into database.`);
    }
  } catch (err) {
    console.error('Error seeding UIP vaccines:', err.message);
  }
}

export function getMongoStatus() {
  return {
    connected: isMongoConnected,
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host || null,
    dbName: mongoose.connection.name || null
  };
}
