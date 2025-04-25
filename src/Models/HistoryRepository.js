import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class HistoryRepository {
  #filePath;

  constructor(filePath = "../../data/history.json") {
    this.#filePath = path.join(__dirname, filePath);
  }

  async saveRecord(record) {
    try {
      // Ensure directory exists
      await fs.mkdir(path.dirname(this.#filePath), { recursive: true });

      let history = [];
      try {
        const data = await fs.readFile(this.#filePath, "utf8");
        if (data.trim()) {
          history = JSON.parse(data);
          if (!Array.isArray(history)) {
            throw new Error("History file is not an array");
          }
        }
      } catch (err) {
        if (err.code !== "ENOENT") {
          throw new Error(`Failed to read history file: ${err.message}`);
        }
      }

      history.push(record);
      await fs.writeFile(this.#filePath, JSON.stringify(history, null, 2));
    } catch (err) {
      throw new Error(`Failed to save record to history: ${err.message}`);
    }
  }

  async getHistory({ userId } = {}) {
    try {
      const data = await fs.readFile(this.#filePath, "utf8");
      if (!data.trim()) {
        return [];
      }
      const history = JSON.parse(data);
      if (!Array.isArray(history)) {
        throw new Error("History file is not an array");
      }
      return userId
        ? history.filter((record) => record.userId === userId)
        : history;
    } catch (err) {
      if (err.code === "ENOENT") {
        return [];
      }
      throw new Error(`Failed to read history: ${err.message}`);
    }
  }
}

export default HistoryRepository;
