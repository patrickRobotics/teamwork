CREATE TABLE Employees (
    Id SERIAL PRIMARY KEY,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    gender VARCHAR(20) NOT NULL,
    jobRole VARCHAR(50) NOT NULL,
    department VARCHAR(50) NULL,
    address VARCHAR(255) NULL,
    createdOn TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Category (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    createdOn TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE Posts (
    id SERIAL PRIMARY KEY,
    articleTitle VARCHAR(255) NOT NULL,
    article VARCHAR(255) NOT NULL,
    authorId INTEGER REFERENCES Employees(id),
    flagged BOOLEAN NULL,
    createdOn TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Gifs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    imageUrl VARCHAR(255) NOT NULL,
    authorId INTEGER REFERENCES Employees(Id),
    flagged BOOLEAN NULL,
    createdOn TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Comments (
    id SERIAL PRIMARY KEY,
    comment VARCHAR(255) NOT NULL,
    postId INTEGER REFERENCES Posts(id),
    gifId INTEGER REFERENCES Gifs(id),
    authorId INTEGER REFERENCES Employees(id),
    createdOn TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
