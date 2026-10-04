import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../../../server/motorvault.db');
const schemaPath = path.resolve(__dirname, './schema.sql');

let rawDb: SqlJsDatabase | null = null;

export async function getDb(): Promise<SqlJsDatabase> {
  if (rawDb) return rawDb;

  const SQL = await initSqlJs();

  // Create directory if needed
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Load existing file or initialize new
  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath);
    rawDb = new SQL.Database(fileBuffer);
  } else {
    rawDb = new SQL.Database();
  }

  // Ensure schema exists
  if (fs.existsSync(schemaPath)) {
    const schema = fs.readFileSync(schemaPath, 'utf8');
    rawDb.run(schema);
    saveDb();
  }

  return rawDb;
}

export function saveDb(): void {
  if (!rawDb) return;
  const data = rawDb.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
}

// Ergonomic database helper
export const db = {
  async all<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    const database = await getDb();
    const stmt = database.prepare(sql);
    stmt.bind(params);
    const results: T[] = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject() as unknown as T);
    }
    stmt.free();
    return results;
  },

  async get<T = any>(sql: string, params: any[] = []): Promise<T | null> {
    const results = await this.all<T>(sql, params);
    return results.length > 0 ? results[0] : null;
  },

  async run(sql: string, params: any[] = []): Promise<void> {
    const database = await getDb();
    database.run(sql, params);
    saveDb();
  },

  async exec(sql: string): Promise<void> {
    const database = await getDb();
    database.run(sql);
    saveDb();
  }
};

export default db;
