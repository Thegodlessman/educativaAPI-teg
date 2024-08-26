-- Crear la extensión para UUIDs si no existe
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla "user" con UUID
CREATE TABLE "user" (
  "id_user" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "id_rol" UUID,
  "ced_user" varchar(20),
  "name" varchar(20),
  "lastname" varchar(20),
  "email" varchar(50),
  "password" varchar(500)
);

-- Tabla "role" con UUID
CREATE TABLE "role" (
  "id_role" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "rol_name" varchar(20),
  "rol_descrip" varchar(200)
);

-- Tabla "institution" con UUID
CREATE TABLE "institution" (
  "id_inst" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "inst_name" varchar(50),
  "descrip_inst" varchar(140),
  "locate_id" UUID
);

-- Tabla "user_institution" con referencias a UUIDs
CREATE TABLE "user_institution" (
  "id_user" UUID,
  "id_inst" UUID
);

-- Tabla "parroquia" con UUID
CREATE TABLE "parroquia" (
  "id_parr" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name_parr" varchar(50),
  "id_mun" UUID
);

-- Tabla "municipio" con UUID
CREATE TABLE "municipio" (
  "id_mun" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name_mun" varchar(50),
  "id_est" UUID
);

-- Tabla "estado" con UUID
CREATE TABLE "estado" (
  "id_est" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name_est" varchar(50)
);

-- Actualizar claves foráneas para que utilicen UUIDs

ALTER TABLE "municipio" 
ADD FOREIGN KEY ("id_est") REFERENCES "estado" ("id_est");

ALTER TABLE "parroquia" 
ADD FOREIGN KEY ("id_mun") REFERENCES "municipio" ("id_mun");

ALTER TABLE "institution" 
ADD FOREIGN KEY ("locate_id") REFERENCES "parroquia" ("id_parr");

ALTER TABLE "user_institution" 
ADD FOREIGN KEY ("id_user") REFERENCES "user" ("id_user");

ALTER TABLE "user_institution" 
ADD FOREIGN KEY ("id_inst") REFERENCES "institution" ("id_inst");

ALTER TABLE "user" 
ADD FOREIGN KEY ("id_rol") REFERENCES "role" ("id_role");


INSERT INTO "role" VALUES (default, 'Profesor', 'Este rol permite a los usuarios crear las actividades y ver el progreso de sus estudiantes')
INSERT INTO "role" VALUES (default, 'Estudiante', 'Este rol permite a los usuarios participar en las actividades y ver su progreso')
INSERT INTO "role" VALUES (default, 'Usuario', 'Este rol es un placeholder mientras se asigna el usuario asigna otro rol')