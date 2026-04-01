import mongoose from 'mongoose';
import env from './env';

class Database {
  private static instance: Database;
  private connected = false;

  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) Database.instance = new Database();
    return Database.instance;
  }

  async connect(): Promise<void> {
    if (this.connected) return;
    await mongoose.connect(env.MONGODB_URI);
    this.connected = true;
    console.log('✅ MongoDB connected');
  }

  async disconnect(): Promise<void> {
    await mongoose.disconnect();
    this.connected = false;
  }
}

export default Database.getInstance();
