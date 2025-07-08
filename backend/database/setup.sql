-- /Library/PostgreSQL/17/bin/psql -U postgres
-- or
--/Library/PostgreSQL/17/bin/psql -U postgres -d setup
-- ask chibuikem for the password if it happens
--create database setup;


--\l to see all the database
--\c setup;
--\dt to see the tables in the database
--to view a specific table in your database "setup" select * from users;
--DROP DATABASE setup

--DROP Table users;
--create a table

    CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    company VARCHAR(255),
    security_level VARCHAR(50),
    concerns TEXT,
    newsletter BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--insert testing data 1
INSERT INTO users (
    full_name,
    email,
    company,
    security_level,
    concerns,
    newsletter
) VALUES (
    'Chibuikem Nwabueze',
    'chibuikem@example.com',
    'SafeNet Corp',
    'High',
    'Interested in advanced encryption methods and data privacy regulations.',
    TRUE
);

--insert testing data 2
INSERT INTO users (
    full_name,
    email,
    company,
    security_level,
    concerns,
    newsletter
) VALUES (
    'Kobi Casper',
    'Tiko@cyberhub.io',
    'CyberHub',
    'Medium',
    'Wants to understand user access control and audit logging.',
    FALSE
);
