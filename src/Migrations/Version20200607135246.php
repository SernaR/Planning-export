<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200607135246 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'sqlite', 'Migration can only be executed safely on \'sqlite\'.');

        $this->addSql('DROP INDEX UNIQ_5CECC7BEF92F3E70');
        $this->addSql('CREATE TEMPORARY TABLE __temp__adress AS SELECT id, country_id, main, secondary, code, city FROM adress');
        $this->addSql('DROP TABLE adress');
        $this->addSql('CREATE TABLE adress (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, country_id INTEGER DEFAULT NULL, main VARCHAR(255) NOT NULL COLLATE BINARY, secondary VARCHAR(255) DEFAULT NULL COLLATE BINARY, code VARCHAR(255) NOT NULL COLLATE BINARY, city VARCHAR(255) NOT NULL COLLATE BINARY, CONSTRAINT FK_5CECC7BEF92F3E70 FOREIGN KEY (country_id) REFERENCES country (id) NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('INSERT INTO adress (id, country_id, main, secondary, code, city) SELECT id, country_id, main, secondary, code, city FROM __temp__adress');
        $this->addSql('DROP TABLE __temp__adress');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_5CECC7BEF92F3E70 ON adress (country_id)');
        $this->addSql('DROP INDEX UNIQ_4739F11C8486F9AC');
        $this->addSql('CREATE TEMPORARY TABLE __temp__carrier AS SELECT id, adress_id, name, contact, telephone, email FROM carrier');
        $this->addSql('DROP TABLE carrier');
        $this->addSql('CREATE TABLE carrier (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, adress_id INTEGER DEFAULT NULL, name VARCHAR(255) NOT NULL COLLATE BINARY, contact VARCHAR(255) NOT NULL COLLATE BINARY, telephone VARCHAR(255) DEFAULT NULL COLLATE BINARY, email VARCHAR(255) DEFAULT NULL COLLATE BINARY, CONSTRAINT FK_4739F11C8486F9AC FOREIGN KEY (adress_id) REFERENCES adress (id) NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('INSERT INTO carrier (id, adress_id, name, contact, telephone, email) SELECT id, adress_id, name, contact, telephone, email FROM __temp__carrier');
        $this->addSql('DROP TABLE __temp__carrier');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_4739F11C8486F9AC ON carrier (adress_id)');
        $this->addSql('DROP INDEX IDX_6826346021DFC797');
        $this->addSql('DROP INDEX IDX_6826346068563B78');
        $this->addSql('DROP INDEX IDX_68263460545317D1');
        $this->addSql('CREATE TEMPORARY TABLE __temp__transport_order AS SELECT id, carrier_id, first_loading_warehouse_id, vehicle_id, code, first_loading_start, first_loading_end, first_delivery, amount, effective_first_loading_start, effective_first_loading_end, effective_first_loading_boxes, effective_first_loading_pallets, effective_first_loading_pieces, effective_first_delivery, weight, volume, created_at, updated_at FROM transport_order');
        $this->addSql('DROP TABLE transport_order');
        $this->addSql('CREATE TABLE transport_order (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, carrier_id INTEGER DEFAULT NULL, first_loading_warehouse_id INTEGER DEFAULT NULL, vehicle_id INTEGER DEFAULT NULL, code VARCHAR(255) NOT NULL COLLATE BINARY, first_loading_start DATETIME NOT NULL, first_loading_end DATETIME NOT NULL, first_delivery DATETIME NOT NULL, amount DOUBLE PRECISION DEFAULT NULL, effective_first_loading_start DATETIME DEFAULT NULL, effective_first_loading_end DATETIME DEFAULT NULL, effective_first_loading_boxes INTEGER DEFAULT NULL, effective_first_loading_pallets INTEGER DEFAULT NULL, effective_first_loading_pieces INTEGER DEFAULT NULL, effective_first_delivery DATETIME DEFAULT NULL, weight DOUBLE PRECISION DEFAULT NULL, volume DOUBLE PRECISION DEFAULT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, CONSTRAINT FK_6826346021DFC797 FOREIGN KEY (carrier_id) REFERENCES carrier (id) NOT DEFERRABLE INITIALLY IMMEDIATE, CONSTRAINT FK_6826346068563B78 FOREIGN KEY (first_loading_warehouse_id) REFERENCES warehouse (id) NOT DEFERRABLE INITIALLY IMMEDIATE, CONSTRAINT FK_68263460545317D1 FOREIGN KEY (vehicle_id) REFERENCES vehicle (id) NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('INSERT INTO transport_order (id, carrier_id, first_loading_warehouse_id, vehicle_id, code, first_loading_start, first_loading_end, first_delivery, amount, effective_first_loading_start, effective_first_loading_end, effective_first_loading_boxes, effective_first_loading_pallets, effective_first_loading_pieces, effective_first_delivery, weight, volume, created_at, updated_at) SELECT id, carrier_id, first_loading_warehouse_id, vehicle_id, code, first_loading_start, first_loading_end, first_delivery, amount, effective_first_loading_start, effective_first_loading_end, effective_first_loading_boxes, effective_first_loading_pallets, effective_first_loading_pieces, effective_first_delivery, weight, volume, created_at, updated_at FROM __temp__transport_order');
        $this->addSql('DROP TABLE __temp__transport_order');
        $this->addSql('CREATE INDEX IDX_6826346021DFC797 ON transport_order (carrier_id)');
        $this->addSql('CREATE INDEX IDX_6826346068563B78 ON transport_order (first_loading_warehouse_id)');
        $this->addSql('CREATE INDEX IDX_68263460545317D1 ON transport_order (vehicle_id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_6826346077153098 ON transport_order (code)');
        $this->addSql('DROP INDEX UNIQ_ECB38BFC8486F9AC');
        $this->addSql('CREATE TEMPORARY TABLE __temp__warehouse AS SELECT id, adress_id, name FROM warehouse');
        $this->addSql('DROP TABLE warehouse');
        $this->addSql('CREATE TABLE warehouse (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, adress_id INTEGER DEFAULT NULL, name VARCHAR(255) NOT NULL COLLATE BINARY, CONSTRAINT FK_ECB38BFC8486F9AC FOREIGN KEY (adress_id) REFERENCES adress (id) NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('INSERT INTO warehouse (id, adress_id, name) SELECT id, adress_id, name FROM __temp__warehouse');
        $this->addSql('DROP TABLE __temp__warehouse');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_ECB38BFC8486F9AC ON warehouse (adress_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'sqlite', 'Migration can only be executed safely on \'sqlite\'.');

        $this->addSql('DROP INDEX UNIQ_5CECC7BEF92F3E70');
        $this->addSql('CREATE TEMPORARY TABLE __temp__adress AS SELECT id, country_id, main, secondary, code, city FROM adress');
        $this->addSql('DROP TABLE adress');
        $this->addSql('CREATE TABLE adress (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, country_id INTEGER DEFAULT NULL, main VARCHAR(255) NOT NULL, secondary VARCHAR(255) DEFAULT NULL, code VARCHAR(255) NOT NULL, city VARCHAR(255) NOT NULL)');
        $this->addSql('INSERT INTO adress (id, country_id, main, secondary, code, city) SELECT id, country_id, main, secondary, code, city FROM __temp__adress');
        $this->addSql('DROP TABLE __temp__adress');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_5CECC7BEF92F3E70 ON adress (country_id)');
        $this->addSql('DROP INDEX UNIQ_4739F11C8486F9AC');
        $this->addSql('CREATE TEMPORARY TABLE __temp__carrier AS SELECT id, adress_id, name, contact, telephone, email FROM carrier');
        $this->addSql('DROP TABLE carrier');
        $this->addSql('CREATE TABLE carrier (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, adress_id INTEGER DEFAULT NULL, name VARCHAR(255) NOT NULL, contact VARCHAR(255) NOT NULL, telephone VARCHAR(255) DEFAULT NULL, email VARCHAR(255) DEFAULT NULL)');
        $this->addSql('INSERT INTO carrier (id, adress_id, name, contact, telephone, email) SELECT id, adress_id, name, contact, telephone, email FROM __temp__carrier');
        $this->addSql('DROP TABLE __temp__carrier');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_4739F11C8486F9AC ON carrier (adress_id)');
        $this->addSql('DROP INDEX UNIQ_6826346077153098');
        $this->addSql('DROP INDEX IDX_6826346021DFC797');
        $this->addSql('DROP INDEX IDX_6826346068563B78');
        $this->addSql('DROP INDEX IDX_68263460545317D1');
        $this->addSql('CREATE TEMPORARY TABLE __temp__transport_order AS SELECT id, carrier_id, first_loading_warehouse_id, vehicle_id, code, first_loading_start, first_loading_end, first_delivery, amount, effective_first_loading_start, effective_first_loading_end, effective_first_loading_boxes, effective_first_loading_pallets, effective_first_loading_pieces, effective_first_delivery, weight, volume, created_at, updated_at FROM transport_order');
        $this->addSql('DROP TABLE transport_order');
        $this->addSql('CREATE TABLE transport_order (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, carrier_id INTEGER DEFAULT NULL, first_loading_warehouse_id INTEGER DEFAULT NULL, vehicle_id INTEGER DEFAULT NULL, code VARCHAR(255) NOT NULL, first_loading_start DATETIME NOT NULL, first_loading_end DATETIME NOT NULL, first_delivery DATETIME NOT NULL, amount DOUBLE PRECISION DEFAULT NULL, effective_first_loading_start DATETIME DEFAULT NULL, effective_first_loading_end DATETIME DEFAULT NULL, effective_first_loading_boxes INTEGER DEFAULT NULL, effective_first_loading_pallets INTEGER DEFAULT NULL, effective_first_loading_pieces INTEGER DEFAULT NULL, effective_first_delivery DATETIME DEFAULT NULL, weight DOUBLE PRECISION DEFAULT NULL, volume DOUBLE PRECISION DEFAULT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL)');
        $this->addSql('INSERT INTO transport_order (id, carrier_id, first_loading_warehouse_id, vehicle_id, code, first_loading_start, first_loading_end, first_delivery, amount, effective_first_loading_start, effective_first_loading_end, effective_first_loading_boxes, effective_first_loading_pallets, effective_first_loading_pieces, effective_first_delivery, weight, volume, created_at, updated_at) SELECT id, carrier_id, first_loading_warehouse_id, vehicle_id, code, first_loading_start, first_loading_end, first_delivery, amount, effective_first_loading_start, effective_first_loading_end, effective_first_loading_boxes, effective_first_loading_pallets, effective_first_loading_pieces, effective_first_delivery, weight, volume, created_at, updated_at FROM __temp__transport_order');
        $this->addSql('DROP TABLE __temp__transport_order');
        $this->addSql('CREATE INDEX IDX_6826346021DFC797 ON transport_order (carrier_id)');
        $this->addSql('CREATE INDEX IDX_6826346068563B78 ON transport_order (first_loading_warehouse_id)');
        $this->addSql('CREATE INDEX IDX_68263460545317D1 ON transport_order (vehicle_id)');
        $this->addSql('DROP INDEX UNIQ_ECB38BFC8486F9AC');
        $this->addSql('CREATE TEMPORARY TABLE __temp__warehouse AS SELECT id, adress_id, name FROM warehouse');
        $this->addSql('DROP TABLE warehouse');
        $this->addSql('CREATE TABLE warehouse (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, adress_id INTEGER DEFAULT NULL, name VARCHAR(255) NOT NULL)');
        $this->addSql('INSERT INTO warehouse (id, adress_id, name) SELECT id, adress_id, name FROM __temp__warehouse');
        $this->addSql('DROP TABLE __temp__warehouse');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_ECB38BFC8486F9AC ON warehouse (adress_id)');
    }
}
