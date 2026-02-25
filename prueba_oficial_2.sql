-- Created by Redgate Data Modeler (https://datamodeler.redgate-platform.com)
-- Last modification date: 2026-02-24 21:39:26.303

-- tables
-- Table: AUDIT_LOGS
CREATE TABLE AUDIT_LOGS (
    id_audit serial  NOT NULL,
    id_user int  NOT NULL,
    action varchar(70)  NOT NULL,
    created_at timestamp  NOT NULL DEFAULT NOW(),
    metadata jsonb  NOT NULL,
    CONSTRAINT AUDIT_LOGS_pk PRIMARY KEY (id_audit)
);

-- Table: CREDENTIALS
CREATE TABLE CREDENTIALS (
    id_credential serial  NOT NULL,
    id_user int  NOT NULL,
    service_name varchar(70)  NOT NULL,
    account_username varchar(70)  NOT NULL,
    password_encrypted text  NOT NULL,
    url text  NULL,
    notes text  NULL,
    created_at timestamp  NOT NULL DEFAULT NOW(),
    updated_at timestamp  NOT NULL DEFAULT NOW(),
    CONSTRAINT CREDENTIALS_pk PRIMARY KEY (id_credential)
);

-- Table: USERS
CREATE TABLE USERS (
    id_user serial  NOT NULL,
    email varchar(70)  NOT NULL,
    password_hash text  NOT NULL,
    created_at timestamp  NOT NULL DEFAULT NOW(),
    CONSTRAINT USERS_pk PRIMARY KEY (id_user)
);

-- foreign keys
-- Reference: CREDENTIALS_USERS (table: CREDENTIALS)
ALTER TABLE CREDENTIALS ADD CONSTRAINT CREDENTIALS_USERS
    FOREIGN KEY (id_user)
    REFERENCES USERS (id_user)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- End of file.