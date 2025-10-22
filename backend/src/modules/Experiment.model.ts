import { ExperimentResult } from '../types';
import { DatabaseConnection } from '../config/database';

export class ExperimentModel {
    private db: any;

    constructor() {
        this.db = DatabaseConnection.getInstance().getDatabase();
    }

    /**
     * Save experiment result to database
     */
    async saveExperiment(experiment: ExperimentResult): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run('BEGIN TRANSACTION');

                // Save experiment
                const experimentStmt = this.db.prepare(`
          INSERT OR REPLACE INTO experiments (id, config, created_at, updated_at)
          VALUES (?, ?, ?, ?)
        `);

                experimentStmt.run(
                    experiment.id,
                    JSON.stringify(experiment.config),
                    experiment.created_at,
                    experiment.updated_at,
                    (err: any) => {
                        if (err) {
                            this.db.run('ROLLBACK');
                            reject(err);
                            return;
                        }
                    }
                );

                // Save responses
                const responseStmt = this.db.prepare(`
          INSERT OR REPLACE INTO responses (id, experiment_id, text, parameters, metadata)
          VALUES (?, ?, ?, ?, ?)
        `);

                let responseCount = 0;
                experiment.responses.forEach(response => {
                    responseStmt.run(
                        response.id,
                        experiment.id,
                        response.text,
                        JSON.stringify(response.parameters),
                        JSON.stringify(response.metadata),
                        (err: any) => {
                            if (err) {
                                this.db.run('ROLLBACK');
                                reject(err);
                                return;
                            }
                            responseCount++;
                            if (responseCount === experiment.responses.length) {
                                // All responses saved, now save metrics
                                this.saveMetrics(experiment).then(() => {
                                    this.db.run('COMMIT', (err: any) => {
                                        if (err) {
                                            reject(err);
                                        } else {
                                            resolve();
                                        }
                                    });
                                }).catch(reject);
                            }
                        }
                    );
                });
            });
        });
    }

    private async saveMetrics(experiment: ExperimentResult): Promise<void> {
        return new Promise((resolve, reject) => {
            const metricsStmt = this.db.prepare(`
        INSERT OR REPLACE INTO metrics (
          response_id, coherence_score, completeness_score, length_score,
          structure_score, overall_score, details
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

            let metricsCount = 0;
            experiment.metrics.forEach(metric => {
                metricsStmt.run(
                    metric.response_id,
                    metric.coherence_score,
                    metric.completeness_score,
                    metric.length_score,
                    metric.structure_score,
                    metric.overall_score,
                    JSON.stringify(metric.details),
                    (err: any) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        metricsCount++;
                        if (metricsCount === experiment.metrics.length) {
                            resolve();
                        }
                    }
                );
            });
        });
    }

    /**
     * Get experiment by ID
     */
    async getExperiment(id: string): Promise<ExperimentResult | null> {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT * FROM experiments WHERE id = ?', [id], (err: any, experiment: any) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (!experiment) {
                    resolve(null);
                    return;
                }

                // Get responses
                this.db.all('SELECT * FROM responses WHERE experiment_id = ?', [id], (err: any, responses: any[]) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    // Get metrics for each response
                    const experimentResult: ExperimentResult = {
                        id: experiment.id,
                        config: JSON.parse(experiment.config),
                        responses: responses.map(response => ({
                            id: response.id,
                            text: response.text,
                            parameters: JSON.parse(response.parameters),
                            metadata: JSON.parse(response.metadata),
                        })),
                        metrics: [],
                        created_at: experiment.created_at,
                        updated_at: experiment.updated_at,
                    };

                    // Get metrics
                    const responseIds = responses.map(r => r.id);
                    const placeholders = responseIds.map(() => '?').join(',');
                    this.db.all(`SELECT * FROM metrics WHERE response_id IN (${placeholders})`,
                        responseIds,
                        (err: any, metrics: any[]) => {
                            if (err) {
                                reject(err);
                                return;
                            }

                            experimentResult.metrics = metrics.map(metric => ({
                                coherence_score: metric.coherence_score,
                                completeness_score: metric.completeness_score,
                                length_score: metric.length_score,
                                structure_score: metric.structure_score,
                                overall_score: metric.overall_score,
                                details: JSON.parse(metric.details),
                                response_id: metric.response_id,
                            }));

                            resolve(experimentResult);
                        }
                    );
                });
            });
        });
    }

    /**
     * Get all experiments with pagination
     */
    async getExperiments(limit: number = 20, offset: number = 0): Promise<ExperimentResult[]> {
        return new Promise((resolve, reject) => {
            this.db.all(`
        SELECT * FROM experiments 
        ORDER BY created_at DESC 
        LIMIT ? OFFSET ?
      `, [limit, offset], async (err: any, experiments: any[]) => {
                if (err) {
                    reject(err);
                    return;
                }

                const results: ExperimentResult[] = [];
                for (const experiment of experiments) {
                    const fullExperiment = await this.getExperiment(experiment.id);
                    if (fullExperiment) {
                        results.push(fullExperiment);
                    }
                }

                resolve(results);
            });
        });
    }

    /**
     * Delete experiment
     */
    async deleteExperiment(id: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const db = this.db; // Store reference to avoid 'this' context issues
            db.serialize(() => {
                db.run('BEGIN TRANSACTION');

                // Delete metrics first (foreign key constraint)
                db.run(`
          DELETE FROM metrics WHERE response_id IN (
            SELECT id FROM responses WHERE experiment_id = ?
          )
        `, [id], (err: any) => {
                    if (err) {
                        db.run('ROLLBACK');
                        reject(err);
                        return;
                    }
                });

                // Delete responses
                db.run('DELETE FROM responses WHERE experiment_id = ?', [id], (err: any) => {
                    if (err) {
                        db.run('ROLLBACK');
                        reject(err);
                        return;
                    }
                });

                // Delete experiment
                db.run('DELETE FROM experiments WHERE id = ?', [id], function (this: any, err: any) {
                    if (err) {
                        db.run('ROLLBACK');
                        reject(err);
                        return;
                    }

                    db.run('COMMIT', function(this: any, err: any) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(this.changes > 0);
                        }
                    });
                });
            });
        });
    }

    /**
     * Get experiment statistics
     */
    async getExperimentStats(): Promise<{
        total_experiments: number;
        total_responses: number;
        average_score: number;
        best_score: number;
        worst_score: number;
    }> {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT COUNT(*) as count FROM experiments', (err: any, totalExperiments: any) => {
                if (err) {
                    reject(err);
                    return;
                }

                this.db.get('SELECT COUNT(*) as count FROM responses', (err: any, totalResponses: any) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    this.db.get(`
            SELECT 
              AVG(overall_score) as avg_score,
              MAX(overall_score) as max_score,
              MIN(overall_score) as min_score
            FROM metrics
          `, (err: any, scoreStats: any) => {
                        if (err) {
                            reject(err);
                            return;
                        }

                        resolve({
                            total_experiments: totalExperiments.count,
                            total_responses: totalResponses.count,
                            average_score: Math.round((scoreStats.avg_score || 0) * 100) / 100,
                            best_score: Math.round((scoreStats.max_score || 0) * 100) / 100,
                            worst_score: Math.round((scoreStats.min_score || 0) * 100) / 100,
                        });
                    });
                });
            });
        });
    }

    /**
     * Search experiments by prompt content
     */
    async searchExperiments(query: string, limit: number = 20): Promise<ExperimentResult[]> {
        return new Promise((resolve, reject) => {
            const searchTerm = `%${query}%`;
            this.db.all(`
        SELECT DISTINCT e.* FROM experiments e
        JOIN responses r ON e.id = r.experiment_id
        WHERE r.text LIKE ? OR e.config LIKE ?
        ORDER BY e.created_at DESC
        LIMIT ?
      `, [searchTerm, searchTerm, limit], async (err: any, experiments: any[]) => {
                if (err) {
                    reject(err);
                    return;
                }

                const results: ExperimentResult[] = [];
                for (const experiment of experiments) {
                    const fullExperiment = await this.getExperiment(experiment.id);
                    if (fullExperiment) {
                        results.push(fullExperiment);
                    }
                }

                resolve(results);
            });
        });
    }
}
