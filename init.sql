\c postgres_db

CREATE TYPE public.userRole AS ENUM (
    'ADMIN',
    'SUBSCRIBER'
);

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying NOT NULL,
    firstName character varying NOT NULL,
    password character varying NOT NULL,
    lastName character varying,
    role public.userRole DEFAULT 'SUBSCRIBER'::public.userRole NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.book (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    title character varying NOT NULL,
    content character varying,
    author character varying,
    publicationYear integer,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.userFavorite (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    userId uuid NOT NULL,
    bookId uuid NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE ONLY public.book
    ADD CONSTRAINT book_pk PRIMARY KEY (id);

ALTER TABLE ONLY public.userfavorite
    ADD CONSTRAINT user_favorite_pk PRIMARY KEY (id);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pk PRIMARY KEY (id);

ALTER TABLE ONLY public.userFavorite
    ADD CONSTRAINT fk_user_id FOREIGN KEY (userId) REFERENCES public.users(id) NOT VALID;

ALTER TABLE ONLY public.userFavorite
    ADD CONSTRAINT fk_book_id FOREIGN KEY (bookId) REFERENCES public.book(id) NOT VALID;
