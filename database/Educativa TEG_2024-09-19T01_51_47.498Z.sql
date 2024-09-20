-- Tabla de roles
CREATE TABLE "roles" (
    "id_rol" UUID NOT NULL UNIQUE,
    "rol_name" VARCHAR NOT NULL,
    "rol_descrip" VARCHAR NOT NULL,
    PRIMARY KEY("id_rol")
);

-- Tabla de usuarios
CREATE TABLE "users" (
    "id_user" UUID NOT NULL UNIQUE,
    "id_rol" UUID NOT NULL,
    "user_url" VARCHAR NOT NULL,
    "user_ced" VARCHAR NOT NULL,
    "user_name" VARCHAR NOT NULL,
    "user_lastname" VARCHAR NOT NULL,
    "user_email" VARCHAR NOT NULL,
    "user_password" VARCHAR NOT NULL,
    PRIMARY KEY("id_user"),
    FOREIGN KEY ("id_rol") REFERENCES "roles"("id_rol") -- Relación correcta con roles
);

-- Tabla de instituciones
CREATE TABLE "institutions" (
    "id_insti" UUID NOT NULL UNIQUE,
    "id_location" UUID NOT NULL,
    "insti_url" VARCHAR NOT NULL,
    "insti_name" VARCHAR NOT NULL,
    "insti_descrip" VARCHAR NOT NULL,
    PRIMARY KEY("id_insti")
);

-- Tabla de países
CREATE TABLE "countries" (
    "id_country" UUID NOT NULL UNIQUE,
    "country_name" VARCHAR NOT NULL,
    PRIMARY KEY("id_country")
);

-- Tabla de estados/provincias
CREATE TABLE "states" (
    "id_state" UUID NOT NULL UNIQUE,
    "state_name" VARCHAR NOT NULL,
    "id_country" UUID NOT NULL,
    PRIMARY KEY("id_state"),
    FOREIGN KEY ("id_country") REFERENCES "countries"("id_country")
);

-- Tabla de municipios
CREATE TABLE "municipalities" (
    "id_municipality" UUID NOT NULL UNIQUE,
    "municipality_name" VARCHAR NOT NULL,  -- Cambio a VARCHAR
    "id_state" UUID NOT NULL,
    PRIMARY KEY("id_municipality"),
    FOREIGN KEY ("id_state") REFERENCES "states"("id_state")
);

-- Tabla de parroquias
CREATE TABLE "parishes" (
    "id_parish" UUID NOT NULL UNIQUE,
    "parish_name" VARCHAR NOT NULL,
    "id_municipality" UUID NOT NULL,
    PRIMARY KEY("id_parish"),
    FOREIGN KEY ("id_municipality") REFERENCES "municipalities"("id_municipality")
);

-- Tabla intermedia para usuarios e instituciones
CREATE TABLE "users_institutions" (
    "id_user_institution" UUID NOT NULL UNIQUE,
    "id_user" UUID NOT NULL,
    "id_institution" UUID NOT NULL,
    PRIMARY KEY("id_user_institution"),
    FOREIGN KEY ("id_user") REFERENCES "users"("id_user"),
    FOREIGN KEY ("id_institution") REFERENCES "institutions"("id_insti"),
	UNIQUE ("id_user", "id_institution")
);
