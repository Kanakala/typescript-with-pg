import { Client } from 'pg';
import { getTransaction, sqlExecSingleRow, commit, rollback } from '../utils/dbUtil';
import logger from '../utils/logger';

const userRole = `CREATE TYPE IF NOT EXISTS public.userRole AS ENUM (
    'ADMIN',
    'SUBSCRIBER'
);`;

const userTable = `CREATE TABLE IF NOT EXISTS public.users (
    id uuid NOT NULL,
    email character varying NOT NULL,
    firstName character varying NOT NULL,
    lastName character varying,
    role public.userRole DEFAULT 'SUBSCRIBER'::public.userRole NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);`;

const bookTable = `CREATE TABLE IF NOT EXISTS public.book (
    id uuid NOT NULL,
    title character varying NOT NULL,
    content character varying,
    author character varying,
    publicationYear integer,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);`;

const userFavoriteTable = `CREATE TABLE IF NOT EXISTS public.userFavorite (
    id uuid NOT NULL,
    userId uuid NOT NULL,
    bookId uuid NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);`;

const alterUserConstraint = `ALTER TABLE ONLY public.userFavorite
    ADD CONSTRAINT fk_user_id FOREIGN KEY (userId) REFERENCES public.users(id);`;

const alterBookonstraint = `ALTER TABLE ONLY public.userFavorite
    ADD CONSTRAINT fk_book_id FOREIGN KEY (bookId) REFERENCES public.book(id);`;

async function executeTable(singleSql: string) {
  try {
    const client: Client = await getTransaction();
    try {
      await sqlExecSingleRow(client, singleSql, []);
      await commit(client);
      return 'Transaction Succeded';
    } catch (error) {
      await rollback(client);
      logger.error(`sampleTransactionModel error: ${error.message}`);
      throw new Error(error.message);
    }
  } catch (err) {
    logger.error(`err: ${err}`);
    throw err;
  }
}

async function executeTables() {
  try {
    const queries = [userRole, userTable, bookTable, userFavoriteTable, alterUserConstraint, alterBookonstraint];
    for (let i = 0; i < queries.length; i++) {
      await executeTable(queries[i]);
    }
  } catch (err) {
    logger.error(`err: ${err}`);
    throw err;
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
executeTables();
