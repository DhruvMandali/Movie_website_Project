--
-- PostgreSQL database dump
--

\restrict VDajEMPsLeFGWqMWWahetnjeBZhQaKbD7wote6g9ztMMt2lNcmhaSBHkeXIH93w

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: favorites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.favorites (
    id integer NOT NULL,
    user_id integer NOT NULL,
    movie_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.favorites OWNER TO postgres;

--
-- Name: favorites_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.favorites_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.favorites_id_seq OWNER TO postgres;

--
-- Name: favorites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.favorites_id_seq OWNED BY public.favorites.id;


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id integer NOT NULL,
    user_id integer NOT NULL,
    movie_id integer NOT NULL,
    review text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reviews_id_seq OWNER TO postgres;

--
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- Name: user_activities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_activities (
    id integer NOT NULL,
    user_id integer,
    user_email character varying(255),
    activity character varying(100) NOT NULL,
    details text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_activities OWNER TO postgres;

--
-- Name: user_activities_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_activities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_activities_id_seq OWNER TO postgres;

--
-- Name: user_activities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_activities_id_seq OWNED BY public.user_activities.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    role character varying(20) DEFAULT 'user'::character varying NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: favorites id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites ALTER COLUMN id SET DEFAULT nextval('public.favorites_id_seq'::regclass);


--
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- Name: user_activities id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_activities ALTER COLUMN id SET DEFAULT nextval('public.user_activities_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.favorites (id, user_id, movie_id, created_at) FROM stdin;
7	6	1423191	2026-10-10 17:03:32.154621
11	6	1368337	2026-10-27 18:52:25.781125
12	6	1148365	2026-10-27 18:53:22.137667
13	6	791523	2026-10-27 18:53:29.517186
14	6	1294189	2026-10-27 18:53:44.421954
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (id, user_id, movie_id, review, created_at, updated_at) FROM stdin;
11	6	1514026	happpcm	2026-10-26 18:37:12.419537	2026-10-26 18:37:12.419537
\.


--
-- Data for Name: user_activities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_activities (id, user_id, user_email, activity, details, created_at) FROM stdin;
1	7	admin1@gmail.com	test_activity	Testing activity logs	2026-10-26 11:46:26.334858+05:30
2	7	admin1@gmail.com	test_activity	Testing activity logs	2026-10-26 12:01:25.173286+05:30
3	6	ram@gmail.com	user_login	User logged in successfully	2026-10-26 16:58:39.576434+05:30
4	6	ram@gmail.com	user_login	User logged in successfully	2026-10-26 17:08:37.340053+05:30
5	6	ram@gmail.com	favorite_removed	Movie ID 1101412 removed from favorites	2026-10-26 17:08:46.206006+05:30
6	6	ram@gmail.com	favorite_added	Movie ID 1561726 added to favorites	2026-10-26 17:09:00.700366+05:30
7	7	admin1@gmail.com	user_login	User logged in successfully	2026-10-26 17:24:34.029473+05:30
8	7	admin1@gmail.com	user_login	User logged in successfully	2026-10-26 17:27:55.417216+05:30
9	6	ram@gmail.com	review_submitted	Review submitted for Movie ID 1514026	2026-10-26 17:48:31.119176+05:30
10	6	ram@gmail.com	user_login	User logged in successfully	2026-10-26 17:50:41.777606+05:30
11	8	testuser3@example.com	user_registered	User registered successfully	2026-10-26 17:54:55.917889+05:30
12	7	admin1@gmail.com	user_login	User logged in successfully	2026-10-26 18:02:26.858666+05:30
13	7	admin1@gmail.com	user_login	User logged in successfully	2026-10-26 18:09:18.030419+05:30
14	6	ram@gmail.com	review_submitted	Review submitted for Movie ID 1514026	2026-10-26 18:37:12.428707+05:30
15	6	ram@gmail.com	user_login	User logged in successfully	2026-10-27 10:25:07.228459+05:30
16	6	ram@gmail.com	user_login	User logged in successfully	2026-10-27 10:27:17.136226+05:30
17	6	ram@gmail.com	user_login	User logged in successfully	2026-10-27 10:42:06.979223+05:30
18	6	ram@gmail.com	user_login	User logged in successfully	2026-10-27 18:26:00.48776+05:30
19	6	ram@gmail.com	favorite_removed	Movie ID 1561726 removed from favorites	2026-10-27 18:48:31.22162+05:30
20	6	ram@gmail.com	favorite_removed	Movie ID 969681 removed from favorites	2026-10-27 18:49:38.460798+05:30
21	6	ram@gmail.com	favorite_added	Movie ID 1368337 added to favorites	2026-10-27 18:52:25.791333+05:30
22	6	ram@gmail.com	favorite_added	Movie ID 1148365 added to favorites	2026-10-27 18:53:22.147565+05:30
23	6	ram@gmail.com	favorite_added	Movie ID 791523 added to favorites	2026-10-27 18:53:29.522792+05:30
24	6	ram@gmail.com	favorite_added	Movie ID 1294189 added to favorites	2026-10-27 18:53:44.429198+05:30
25	7	admin1@gmail.com	user_login	User logged in successfully	2026-10-27 18:58:15.393131+05:30
26	7	admin1@gmail.com	user_login	User logged in successfully	2026-10-27 19:18:39.144663+05:30
27	6	ram@gmail.com	user_login	User logged in successfully	2026-10-27 19:23:03.119179+05:30
28	7	admin1@gmail.com	user_login	User logged in successfully	2026-10-27 19:24:37.833469+05:30
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password_hash, created_at, role) FROM stdin;
3	Test User2	testuser1@example.com	$2b$12$I2gKXGg5N0fbkw5g9x251eAafHNfGrjah/ZBEXmKfHM5uvgwwC1qu	2026-10-10 10:04:37.738489	user
4	Test User2	testuser2@example.com	$2b$12$0bV7qaYJuh20CXGHQ1yFy.j3TaTihOWtK8Q0wT3eXtEYnUyTwVLoG	2026-10-10 10:05:44.976037	user
5	dhruv	dhruv@gmail.com	$2b$12$8HDedCqw0KhPCF4Oqr20qOcRQ9wfY1ugMhBGZDw0v1ZYqmrWDzTkO	2026-10-10 11:29:42.626061	user
6	ram	ram@gmail.com	$2b$12$tqY5VqT/XlxFNqhhdfz5neACloeVi7W3Ikd.mcnow0iNeouAIT4X6	2026-10-10 11:55:17.307987	user
7	admin1	admin1@gmail.com	$2b$10$AVh9O/bQiRuduKsxchFZG.IF4uPBt0lOVgQ.pdSggE4lcJYN86lUK	2026-10-13 19:12:44.059371	admin
8	Test User3	testuser3@example.com	$2b$12$ll5NsLRlaSbQW8yiv8eufedVvfnjKBX/iBDwPISdRxjdZhuqWKYua	2026-10-26 17:54:55.911254	user
\.


--
-- Name: favorites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.favorites_id_seq', 14, true);


--
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reviews_id_seq', 11, true);


--
-- Name: user_activities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_activities_id_seq', 28, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 8, true);


--
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (id);


--
-- Name: favorites favorites_user_id_movie_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_movie_id_key UNIQUE (user_id, movie_id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_user_id_movie_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_movie_id_key UNIQUE (user_id, movie_id);


--
-- Name: user_activities user_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_activities
    ADD CONSTRAINT user_activities_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: favorites favorites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_activities user_activities_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_activities
    ADD CONSTRAINT user_activities_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict VDajEMPsLeFGWqMWWahetnjeBZhQaKbD7wote6g9ztMMt2lNcmhaSBHkeXIH93w

