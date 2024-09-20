CREATE TABLE "usuario" (
  "id_usuario" serial PRIMARY KEY,
  "id_rol" int NOT NULL,
  "cedula" varchar(20) NOT NULL CHECK (TRIM(cedula) <> ''),
  "password" varchar(20) NOT NULL CHECK (TRIM(password) <> ''),
  "nombre" varchar(50) NOT NULL CHECK (TRIM(nombre) <> ''),
  "apellido" varchar(50) NOT NULL CHECK (TRIM(apellido) <> ''),
  CONSTRAINT fk_rol FOREIGN KEY ("id_rol") REFERENCES "rol" ("id_rol")
);

CREATE TABLE "rol" (
  "id_rol" serial PRIMARY KEY,
  "nombre_rol" varchar(20) NOT NULL CHECK (TRIM(nombre_rol) <> ''),
  "descrip_rol" varchar(300) NOT NULL CHECK (TRIM(descrip_rol) <> '')
);

CREATE TABLE "prueba" (
  "id_prue" serial PRIMARY KEY,
  "nombre_prue" varchar(50) NOT NULL CHECK (TRIM(nombre_prue) <> ''),
  "descrip_prueb" varchar(300) NOT NULL CHECK (TRIM(descrip_prueb) <> ''),
  "fecha" timestamp NOT NULL
);

CREATE TABLE "resultado" (
  "id_res" serial PRIMARY KEY,
  "id_prue" int NOT NULL,
  "id_usuario" int NOT NULL,
  "descrip" varchar(300) NOT NULL CHECK (TRIM(descrip) <> ''),
  CONSTRAINT fk_prueba FOREIGN KEY ("id_prue") REFERENCES "prueba" ("id_prue"),
  CONSTRAINT fk_usuario FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id_usuario")
);