DROP DATABASE IF EXISTS temps;
CREATE DATABASE temps;

USE temps;

CREATE TABLE temperatures (
    id INT AUTO_INCREMENT PRIMARY KEY,
    temperature DECIMAL(5,2)
);

ALTER USER 'root' IDENTIFIED WITH caching_sha2_password BY 'Atypon#123'; 

flush privileges;