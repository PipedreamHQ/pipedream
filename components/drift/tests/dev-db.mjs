// dev-db.js
import  storage from "node-persist";

// Immediately initialize the storage
await storage.init({
  dir: "./dev-db", // directory where data will be stored
});

// You can now export functions similar to $.service.db
export default {
  async get(key) {
    return await storage.getItem(key);
  },
  async set(key, value) {
    await storage.setItem(key, value);
  },
  async delete(key) {
    await storage.removeItem(key);
  },
  async list() {
    return await storage.keys();
  },
  async clear() {
    await storage.clear();
  },
};