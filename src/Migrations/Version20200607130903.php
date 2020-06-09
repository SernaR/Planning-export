<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200607130903 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'sqlite', 'Migration can only be executed safely on \'sqlite\'.');

        $this->addSql('CREATE TABLE adress (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, country_id INTEGER DEFAULT NULL, main VARCHAR(255) NOT NULL, secondary VARCHAR(255) DEFAULT NULL, code VARCHAR(255) NOT NULL, city VARCHAR(255) NOT NULL)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_5CECC7BEF92F3E70 ON adress (country_id)');
        $this->addSql('CREATE TABLE carrier (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, adress_id INTEGER DEFAULT NULL, name VARCHAR(255) NOT NULL, contact VARCHAR(255) NOT NULL, telephone VARCHAR(255) DEFAULT NULL, email VARCHAR(255) DEFAULT NULL)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_4739F11C8486F9AC ON carrier (adress_id)');
        $this->addSql('CREATE TABLE country (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name VARCHAR(255) NOT NULL, code VARCHAR(255) NOT NULL)');
        $this->addSql('CREATE TABLE transport_order (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, carrier_id INTEGER DEFAULT NULL, first_loading_warehouse_id INTEGER DEFAULT NULL, vehicle_id INTEGER DEFAULT NULL, code VARCHAR(255) NOT NULL, first_loading_start DATETIME NOT NULL, first_loading_end DATETIME NOT NULL, first_delivery DATETIME NOT NULL, amount DOUBLE PRECISION DEFAULT NULL, effective_first_loading_start DATETIME DEFAULT NULL, effective_first_loading_end DATETIME DEFAULT NULL, effective_first_loading_boxes INTEGER DEFAULT NULL, effective_first_loading_pallets INTEGER DEFAULT NULL, effective_first_loading_pieces INTEGER DEFAULT NULL, effective_first_delivery DATETIME DEFAULT NULL, weight DOUBLE PRECISION DEFAULT NULL, volume DOUBLE PRECISION DEFAULT NULL)');
        $this->addSql('CREATE INDEX IDX_6826346021DFC797 ON transport_order (carrier_id)');
        $this->addSql('CREATE INDEX IDX_6826346068563B78 ON transport_order (first_loading_warehouse_id)');
        $this->addSql('CREATE INDEX IDX_68263460545317D1 ON transport_order (vehicle_id)');
        $this->addSql('CREATE TABLE vehicle (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name VARCHAR(255) NOT NULL)');
        $this->addSql('CREATE TABLE warehouse (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, adress_id INTEGER DEFAULT NULL, name VARCHAR(255) NOT NULL)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_ECB38BFC8486F9AC ON warehouse (adress_id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'sqlite', 'Migration can only be executed safely on \'sqlite\'.');

        $this->addSql('DROP TABLE adress');
        $this->addSql('DROP TABLE carrier');
        $this->addSql('DROP TABLE country');
        $this->addSql('DROP TABLE transport_order');
        $this->addSql('DROP TABLE vehicle');
        $this->addSql('DROP TABLE warehouse');
    }
}
