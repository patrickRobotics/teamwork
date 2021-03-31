CREATE TABLE IF NOT EXISTS users (
    userId SERIAL PRIMARY KEY,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    gender VARCHAR(20) NOT NULL,
    is_admin BOOLEAN NOT NULL,
    department VARCHAR(50) NULL,
    address VARCHAR(255) NULL,
    createdOn TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS category (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    createdOn TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    articleTitle VARCHAR(255) NOT NULL,
    article VARCHAR(255) NOT NULL,
    authorId INTEGER REFERENCES users(userId),
    flagged BOOLEAN NULL,
    createdOn TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS gifs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    imageUrl VARCHAR(255) NOT NULL,
    authorId INTEGER REFERENCES users(userId),
    flagged BOOLEAN NULL,
    createdOn TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    comment VARCHAR(255) NOT NULL,
    postId INTEGER REFERENCES posts(id) NULL,
    gifId INTEGER REFERENCES gifs(id) NULL,
    authorId INTEGER REFERENCES users(userId),
    createdOn TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
)