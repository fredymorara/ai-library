-- Enable pgvector extension
create extension if not exists vector;

-- 1. Institutions
create table institutions (
    id uuid primary key default gen_random_uuid(),
    clerk_org_id text unique not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. API Keys
create table api_keys (
    id uuid primary key default gen_random_uuid(),
    institution_id uuid references institutions(id) on delete cascade not null,
    key_hash text unique not null,
    is_active boolean default true not null,
    last_used_at timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Books
create table books (
    id uuid primary key default gen_random_uuid(),
    institution_id uuid references institutions(id) on delete cascade not null,
    title text not null,
    author text not null,
    is_ingested boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Book Vectors (Embeddings)
create table book_vectors (
    id uuid primary key default gen_random_uuid(),
    book_id uuid references books(id) on delete cascade not null,
    institution_id uuid references institutions(id) on delete cascade not null,
    content text not null,
    embedding vector(384), -- Using 384 for Gemini compatibility as configured
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Chat Sessions (Analytics)
create table chat_sessions (
    id uuid primary key default gen_random_uuid(),
    institution_id uuid references institutions(id) on delete cascade not null,
    api_key_id uuid references api_keys(id) on delete set null,
    first_user_message text,
    started_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Vector Search RPC
create or replace function match_book_vectors (
    query_embedding vector(384),
    p_institution_id uuid,
    match_threshold float,
    match_count int
)
returns table (
    id uuid,
    book_id uuid,
    content text,
    similarity float
)
language plpgsql
as $$
begin
    return query
    select
        bv.id,
        bv.book_id,
        bv.content,
        1 - (bv.embedding <=> query_embedding) as similarity
    from book_vectors bv
    where bv.institution_id = p_institution_id
      and 1 - (bv.embedding <=> query_embedding) > match_threshold
    order by bv.embedding <=> query_embedding
    limit match_count;
end;
$$;
