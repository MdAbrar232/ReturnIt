
CREATE DATABASE returnit_db;



CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    university_id VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE administrator (
    admin_id SERIAL PRIMARY KEY,
    user_id INT UNIQUE,
    admin_level INT NOT NULL,

    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);


CREATE TABLE location (
    location_id SERIAL PRIMARY KEY,
    building VARCHAR(100),
    room VARCHAR(50),
    description TEXT
);


CREATE TABLE report (
    report_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    location_id INT,
    report_type VARCHAR(100),
    report_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(50),
    description TEXT,

    FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE,

    FOREIGN KEY(location_id) REFERENCES location(location_id) ON DELETE SET NULL
);


CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE item (
    item_id SERIAL PRIMARY KEY,
    report_id INT NOT NULL,
    category_id INT,

    title VARCHAR(150),
    brand VARCHAR(100),
    color VARCHAR(50),
    condition VARCHAR(100),
    current_status VARCHAR(50),

    FOREIGN KEY(report_id) REFERENCES report(report_id) ON DELETE CASCADE,

    FOREIGN KEY(category_id) REFERENCES category(category_id) ON DELETE SET NULL
);


CREATE TABLE photo (
    photo_id SERIAL PRIMARY KEY,
    item_id INT NOT NULL,
    image_url TEXT,
    upload_date DATE DEFAULT CURRENT_DATE,

    FOREIGN KEY(item_id) REFERENCES item(item_id) ON DELETE CASCADE
);


CREATE TABLE claim (
    claim_id SERIAL PRIMARY KEY,
    item_id INT NOT NULL,
    user_id INT NOT NULL,

    claim_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(50),
    proof TEXT,
    remarks TEXT,


    FOREIGN KEY(item_id) REFERENCES item(item_id) ON DELETE CASCADE,

    FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

