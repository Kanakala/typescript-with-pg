import { Client, Pool, QueryResult } from 'pg';
import config from '../config/config';
import logger from './logger';

const pgconfig = {
  user: config.db.user,
  database: config.db.database,
  password: config.db.password,
  host: config.db.host,
  port: config.db.port,
  max: config.db.max,
  idleTimeoutMillis: config.db.idleTimeoutMillis,
};

const pool = new Pool(pgconfig);

logger.info(`DB Connection Settings: ${JSON.stringify(pgconfig)}`);

pool.on('error', function (err: Error) {
  logger.error(`idle client error, ${err.message} | ${err.stack}`);
});

/*
 * Single Query to Postgres
 * @param sql: the query for store data
 * @param data: the data to be stored
 * @return result
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sqlToDB = async (sql: string, data: string[][]): Promise<QueryResult> => {
  logger.debug(`sqlToDB() sql: ${sql} | data: ${data}`);
  try {
    const result: QueryResult = await pool.query(sql, data);
    logger.info(`result: ${JSON.stringify(result)}`);
    return result;
  } catch (error) {
    throw error;
  }
};

/*
 * Retrieve a SQL client with transaction from connection pool. If the client is valid, either
 * COMMMIT or ROALLBACK needs to be called at the end before releasing the connection back to pool.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getTransaction = async (): Promise<any> => {
  logger.debug(`getTransaction()`);
  const client: Client = await pool.connect();
  try {
    await client.query('BEGIN');
    return client;
  } catch (error) {
    throw error;
  }
};

/*
 * Execute a sql statment with a single row of data
 * @param sql: the query for store data
 * @param data: the data to be stored
 * @return result
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sqlExecSingleRow = async (client: Client, sql: string, data: string[][]): Promise<any> => {
  logger.debug(`sqlExecSingleRow() sql: ${sql} | data: ${data}`);
  let result: QueryResult;
  try {
    result = await client.query(sql, data);
    logger.debug(`sqlExecSingleRow(): ${result.command} | ${result.rowCount}`);
    return result;
  } catch (error) {
    logger.error(`sqlExecSingleRow() error: ${error.message} | sql: ${sql} | data: ${data}`);
    throw error;
  }
};

/*
 * Execute a sql statement with multiple rows of parameter data.
 * @param sql: the query for store data
 * @param data: the data to be stored
 * @return result
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sqlExecMultipleRows = async (client: Client, sql: string, data: string[][]): Promise<any> => {
  logger.debug(`inside sqlExecMultipleRows()`);
  logger.debug(`sqlExecMultipleRows() data: ${data}`);
  if (data.length !== 0) {
    for (const item of data) {
      try {
        logger.debug(`sqlExecMultipleRows() item: ${item}`);
        logger.debug(`sqlExecMultipleRows() sql: ${sql}`);
        await client.query(sql, item);
      } catch (error) {
        logger.error(`sqlExecMultipleRows() error: ${error}`);
        throw error;
      }
    }
  } else {
    logger.error(`sqlExecMultipleRows(): No data available`);
    throw new Error('sqlExecMultipleRows(): No data available');
  }
};

/*
 * Rollback transaction
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const rollback = async (client: Client): Promise<any> => {
  if (typeof client !== 'undefined' && client) {
    try {
      logger.info(`sql transaction rollback`);
      await client.query('ROLLBACK');
    } catch (error) {
      throw error;
    } finally {
      client.release();
    }
  } else {
    logger.warn(`rollback() not excuted. client is not set`);
  }
};

/*
 * Commit transaction
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const commit = async (client: Client): Promise<any> => {
  logger.debug(`sql transaction committed`);
  try {
    await client.query('COMMIT');
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};
