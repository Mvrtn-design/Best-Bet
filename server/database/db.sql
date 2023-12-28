CREATE DATABASE bestbetdb IF NOT EXISTS;

USE bestbetdb;

CREATE TABLE usuario IF NOT EXISTS (
id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(30) NOT NULL,
nombre_usuario VARCHAR(30) NOT NULL,
correo_electronico VARCHAR(50));

create table  IF NOT EXISTS  club (
ID INT UNSIGNED  AUTO_INCREMENT primary KEY,
name  varchar (40) NOT NULL UNIQUE,
full_name VARCHAR (100) NOT NULL,
country VARCHAR (40) NOT NULL,
category INT(2) NOT NULL,
stadium VARCHAR (50) NOT NULL,
colors VARCHAR (60) NOT NULL,
nickname VARCHAR (50) NOT NULL);


CREATE TABLE IF NOT EXISTS bestbetdb.partido (
    ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    equipo_local INT UNSIGNED,
    equipo_visitante INT UNSIGNED,
    estado VARCHAR(30) NOT NULL,
    fecha DATE , 
    location VARCHAR(40) NOT NULL,
    stadium VARCHAR(50) NOT NULL,
    marcador_local INT(1),
    marcador_visitante INT(1),
    cuota_local DECIMAL(4,2),
    cuota_empate DECIMAL(4,2),
    cuota_visitante DECIMAL(4,2),
    FOREIGN KEY (equipo_local) REFERENCES club (ID),
    FOREIGN KEY (equipo_visitante) REFERENCES club (ID)
);

SHOW TABLES;

describe usuario;