DROP DATABASE mindful_moment;
CREATE DATABASE mindful_moment;


CREATE TABLE users (
    username VARCHAR(255),
    password TEXT NOT NULL, 
    is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE journal (
    id SERIAL PRIMARY KEY, 
    username VARCHAR(255),
    activity_name VARCHAR(255),
    journal_entry TEXT,
    journal_date DATE
);



CREATE TABLE activities_calendar (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255),
    activity_name VARCHAR(255),
    activity_description VARCHAR(255),
    scheduled_date DATE,
    scheduled_time TIME,
    repeat_frequency VARCHAR(20),  
    repeat_days VARCHAR(50),  
    start_time TIME,     
    start_date DATE,
    end_date DATE,
    reminder_time TIME,
    reminder_frequency VARCHAR(20)  
);



-- CREATE TABLE activities (
--     id SERIAL PRIMARY KEY, 
--     activity_name VARCHAR(255),
--     username VARCHAR(255),
--     activity_description TEXT
-- );





-- CREATE TABLE resources (
--     resource_id INT PRIMARY KEY,
--     title VARCHAR(255),
--     description TEXT,
--     url VARCHAR(255)
-- );


-- CREATE TABLE mood (
--     mood_id INT PRIMARY KEY,
--     username VARCHAR(255),
--     mood_value INT,
--     entry_date DATE,
--     additional_notes TEXT,
--     FOREIGN KEY (user_id) REFERENCES users(user_id)
-- );



-- CREATE TABLE userProgress (
--     progress_id INT PRIMARY KEY,
--     username VARCHAR(255),
--     activity_id INT,
--     start_date DATE,
--     target_date DATE,
--     completion_status BOOLEAN,
--     FOREIGN KEY (user_id) REFERENCES users(user_id)
-- );



-- INSERT INTO journalEntries(journal_id,user_id, entry_text, entry_date) VALUES(0,0, 'first entry','2024-01-03')




INSERT INTO journal (
    username,
    journal_entry, 
    journal_date, 
    activity_name)
VALUES (
    'newUser', 
    'took a walk and made snow angels',
    '2024-1-14',
    'Walking'
    );

    INSERT INTO journal (
    username,
    journal_entry, 
    journal_date, 
    activity_name)
VALUES (
    'newUser', 
    'Tried to meditate for 5 mins ended up sleeping for an hour',
    '2024-1-14',
    'Meditate'
    );

INSERT INTO users(
    username,
    password, 
    is_admin)
VALUES
(
   'maggieTest2',
    'xyz123',
   't'
)