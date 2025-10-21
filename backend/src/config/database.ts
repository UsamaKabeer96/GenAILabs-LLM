import sqlite3 from 'sqlite3';
import { config } from './index';

export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private db: sqlite3.Database;

  private constructor() {
    this.db = new sqlite3.Database(config.DATABASE_PATH);
    this.initializeTables();
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public getDatabase(): sqlite3.Database {
    return this.db;
  }

  private initializeTables(): void {
    // Experiments table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS experiments (
        id TEXT PRIMARY KEY,
        config TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);

    // Responses table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS responses (
        id TEXT PRIMARY KEY,
        experiment_id TEXT NOT NULL,
        text TEXT NOT NULL,
        parameters TEXT NOT NULL,
        metadata TEXT NOT NULL,
        FOREIGN KEY (experiment_id) REFERENCES experiments (id)
      )
    `);

    // Metrics table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS metrics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        response_id TEXT NOT NULL,
        coherence_score REAL NOT NULL,
        completeness_score REAL NOT NULL,
        length_score REAL NOT NULL,
        structure_score REAL NOT NULL,
        overall_score REAL NOT NULL,
        details TEXT NOT NULL,
        FOREIGN KEY (response_id) REFERENCES responses (id)
      )
    `);

    // Create indexes for better performance
    this.db.run(`
      CREATE INDEX IF NOT EXISTS idx_responses_experiment_id ON responses (experiment_id)
    `);
    this.db.run(`
      CREATE INDEX IF NOT EXISTS idx_metrics_response_id ON metrics (response_id)
    `);
    this.db.run(`
      CREATE INDEX IF NOT EXISTS idx_experiments_created_at ON experiments (created_at)
    `);
  }

  public close(): void {
    this.db.close();
  }
}
