<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200731172319 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE adress (id INT AUTO_INCREMENT NOT NULL, country_id INT DEFAULT NULL, main VARCHAR(255) NOT NULL, secondary VARCHAR(255) DEFAULT NULL, code VARCHAR(255) NOT NULL, city VARCHAR(255) NOT NULL, INDEX IDX_5CECC7BEF92F3E70 (country_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE carrier (id INT AUTO_INCREMENT NOT NULL, adress_id INT DEFAULT NULL, name VARCHAR(255) NOT NULL, contact VARCHAR(255) NOT NULL, telephone VARCHAR(255) DEFAULT NULL, email VARCHAR(255) DEFAULT NULL, UNIQUE INDEX UNIQ_4739F11C8486F9AC (adress_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE country (id INT AUTO_INCREMENT NOT NULL, initial_params_id INT DEFAULT NULL, name VARCHAR(255) NOT NULL, code VARCHAR(255) NOT NULL, INDEX IDX_5373C966F825C0DA (initial_params_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE destination_params (id INT AUTO_INCREMENT NOT NULL, country_id INT DEFAULT NULL, initial_params_id INT DEFAULT NULL, UNIQUE INDEX UNIQ_DDF79164F92F3E70 (country_id), INDEX IDX_DDF79164F825C0DA (initial_params_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE destination_params_carrier (destination_params_id INT NOT NULL, carrier_id INT NOT NULL, INDEX IDX_579D51E1621C7AF5 (destination_params_id), INDEX IDX_579D51E121DFC797 (carrier_id), PRIMARY KEY(destination_params_id, carrier_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE initial_params (id INT AUTO_INCREMENT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE rate (id INT AUTO_INCREMENT NOT NULL, first_loading_warehouse_id INT DEFAULT NULL, first_delivery_warehouse_id INT DEFAULT NULL, carrier_id INT DEFAULT NULL, second_loading_warehouse_id INT DEFAULT NULL, second_delivery_warehouse_id INT DEFAULT NULL, amount DOUBLE PRECISION NOT NULL, INDEX IDX_DFEC3F3968563B78 (first_loading_warehouse_id), INDEX IDX_DFEC3F394A7A3B5E (first_delivery_warehouse_id), INDEX IDX_DFEC3F3921DFC797 (carrier_id), INDEX IDX_DFEC3F3916068855 (second_loading_warehouse_id), INDEX IDX_DFEC3F39FDB3798 (second_delivery_warehouse_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE transport_order (id INT AUTO_INCREMENT NOT NULL, carrier_id INT DEFAULT NULL, first_loading_warehouse_id INT DEFAULT NULL, vehicle_id INT DEFAULT NULL, first_delivery_warehouse_id INT DEFAULT NULL, second_loading_warehouse_id INT DEFAULT NULL, second_delivery_warehouse_id INT DEFAULT NULL, code VARCHAR(255) NOT NULL, first_loading_start DATETIME NOT NULL, first_loading_end DATETIME NOT NULL, first_delivery DATETIME NOT NULL, amount DOUBLE PRECISION DEFAULT NULL, effective_first_loading_start DATETIME DEFAULT NULL, effective_first_loading_end DATETIME DEFAULT NULL, effective_first_loading_boxes INT DEFAULT NULL, effective_first_loading_pallets INT DEFAULT NULL, effective_first_loading_pieces INT DEFAULT NULL, effective_first_delivery DATETIME DEFAULT NULL, weight INT DEFAULT NULL, volume DOUBLE PRECISION DEFAULT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, invoice VARCHAR(255) DEFAULT NULL, comment LONGTEXT DEFAULT NULL, is_cancelled TINYINT(1) DEFAULT NULL, second_loading_start DATETIME DEFAULT NULL, effective_second_loading_start DATETIME DEFAULT NULL, second_loading_end DATETIME DEFAULT NULL, effective_second_loading_end DATETIME DEFAULT NULL, second_delivery DATETIME DEFAULT NULL, effective_second_delivery DATETIME DEFAULT NULL, UNIQUE INDEX UNIQ_6826346077153098 (code), INDEX IDX_6826346021DFC797 (carrier_id), INDEX IDX_6826346068563B78 (first_loading_warehouse_id), INDEX IDX_68263460545317D1 (vehicle_id), INDEX IDX_682634604A7A3B5E (first_delivery_warehouse_id), INDEX IDX_6826346016068855 (second_loading_warehouse_id), INDEX IDX_68263460FDB3798 (second_delivery_warehouse_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, UNIQUE INDEX UNIQ_8D93D649E7927C74 (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE vehicle (id INT AUTO_INCREMENT NOT NULL, initial_params_id INT DEFAULT NULL, name VARCHAR(255) NOT NULL, INDEX IDX_1B80E486F825C0DA (initial_params_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE warehouse (id INT AUTO_INCREMENT NOT NULL, adress_id INT DEFAULT NULL, initial_params_id INT DEFAULT NULL, destination_params_id INT DEFAULT NULL, name VARCHAR(255) NOT NULL, UNIQUE INDEX UNIQ_ECB38BFC8486F9AC (adress_id), INDEX IDX_ECB38BFCF825C0DA (initial_params_id), INDEX IDX_ECB38BFC621C7AF5 (destination_params_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE adress ADD CONSTRAINT FK_5CECC7BEF92F3E70 FOREIGN KEY (country_id) REFERENCES country (id)');
        $this->addSql('ALTER TABLE carrier ADD CONSTRAINT FK_4739F11C8486F9AC FOREIGN KEY (adress_id) REFERENCES adress (id)');
        $this->addSql('ALTER TABLE country ADD CONSTRAINT FK_5373C966F825C0DA FOREIGN KEY (initial_params_id) REFERENCES initial_params (id)');
        $this->addSql('ALTER TABLE destination_params ADD CONSTRAINT FK_DDF79164F92F3E70 FOREIGN KEY (country_id) REFERENCES country (id)');
        $this->addSql('ALTER TABLE destination_params ADD CONSTRAINT FK_DDF79164F825C0DA FOREIGN KEY (initial_params_id) REFERENCES initial_params (id)');
        $this->addSql('ALTER TABLE destination_params_carrier ADD CONSTRAINT FK_579D51E1621C7AF5 FOREIGN KEY (destination_params_id) REFERENCES destination_params (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE destination_params_carrier ADD CONSTRAINT FK_579D51E121DFC797 FOREIGN KEY (carrier_id) REFERENCES carrier (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE rate ADD CONSTRAINT FK_DFEC3F3968563B78 FOREIGN KEY (first_loading_warehouse_id) REFERENCES warehouse (id)');
        $this->addSql('ALTER TABLE rate ADD CONSTRAINT FK_DFEC3F394A7A3B5E FOREIGN KEY (first_delivery_warehouse_id) REFERENCES warehouse (id)');
        $this->addSql('ALTER TABLE rate ADD CONSTRAINT FK_DFEC3F3921DFC797 FOREIGN KEY (carrier_id) REFERENCES carrier (id)');
        $this->addSql('ALTER TABLE rate ADD CONSTRAINT FK_DFEC3F3916068855 FOREIGN KEY (second_loading_warehouse_id) REFERENCES warehouse (id)');
        $this->addSql('ALTER TABLE rate ADD CONSTRAINT FK_DFEC3F39FDB3798 FOREIGN KEY (second_delivery_warehouse_id) REFERENCES warehouse (id)');
        $this->addSql('ALTER TABLE transport_order ADD CONSTRAINT FK_6826346021DFC797 FOREIGN KEY (carrier_id) REFERENCES carrier (id)');
        $this->addSql('ALTER TABLE transport_order ADD CONSTRAINT FK_6826346068563B78 FOREIGN KEY (first_loading_warehouse_id) REFERENCES warehouse (id)');
        $this->addSql('ALTER TABLE transport_order ADD CONSTRAINT FK_68263460545317D1 FOREIGN KEY (vehicle_id) REFERENCES vehicle (id)');
        $this->addSql('ALTER TABLE transport_order ADD CONSTRAINT FK_682634604A7A3B5E FOREIGN KEY (first_delivery_warehouse_id) REFERENCES warehouse (id)');
        $this->addSql('ALTER TABLE transport_order ADD CONSTRAINT FK_6826346016068855 FOREIGN KEY (second_loading_warehouse_id) REFERENCES warehouse (id)');
        $this->addSql('ALTER TABLE transport_order ADD CONSTRAINT FK_68263460FDB3798 FOREIGN KEY (second_delivery_warehouse_id) REFERENCES warehouse (id)');
        $this->addSql('ALTER TABLE vehicle ADD CONSTRAINT FK_1B80E486F825C0DA FOREIGN KEY (initial_params_id) REFERENCES initial_params (id)');
        $this->addSql('ALTER TABLE warehouse ADD CONSTRAINT FK_ECB38BFC8486F9AC FOREIGN KEY (adress_id) REFERENCES adress (id)');
        $this->addSql('ALTER TABLE warehouse ADD CONSTRAINT FK_ECB38BFCF825C0DA FOREIGN KEY (initial_params_id) REFERENCES initial_params (id)');
        $this->addSql('ALTER TABLE warehouse ADD CONSTRAINT FK_ECB38BFC621C7AF5 FOREIGN KEY (destination_params_id) REFERENCES destination_params (id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE carrier DROP FOREIGN KEY FK_4739F11C8486F9AC');
        $this->addSql('ALTER TABLE warehouse DROP FOREIGN KEY FK_ECB38BFC8486F9AC');
        $this->addSql('ALTER TABLE destination_params_carrier DROP FOREIGN KEY FK_579D51E121DFC797');
        $this->addSql('ALTER TABLE rate DROP FOREIGN KEY FK_DFEC3F3921DFC797');
        $this->addSql('ALTER TABLE transport_order DROP FOREIGN KEY FK_6826346021DFC797');
        $this->addSql('ALTER TABLE adress DROP FOREIGN KEY FK_5CECC7BEF92F3E70');
        $this->addSql('ALTER TABLE destination_params DROP FOREIGN KEY FK_DDF79164F92F3E70');
        $this->addSql('ALTER TABLE destination_params_carrier DROP FOREIGN KEY FK_579D51E1621C7AF5');
        $this->addSql('ALTER TABLE warehouse DROP FOREIGN KEY FK_ECB38BFC621C7AF5');
        $this->addSql('ALTER TABLE country DROP FOREIGN KEY FK_5373C966F825C0DA');
        $this->addSql('ALTER TABLE destination_params DROP FOREIGN KEY FK_DDF79164F825C0DA');
        $this->addSql('ALTER TABLE vehicle DROP FOREIGN KEY FK_1B80E486F825C0DA');
        $this->addSql('ALTER TABLE warehouse DROP FOREIGN KEY FK_ECB38BFCF825C0DA');
        $this->addSql('ALTER TABLE transport_order DROP FOREIGN KEY FK_68263460545317D1');
        $this->addSql('ALTER TABLE rate DROP FOREIGN KEY FK_DFEC3F3968563B78');
        $this->addSql('ALTER TABLE rate DROP FOREIGN KEY FK_DFEC3F394A7A3B5E');
        $this->addSql('ALTER TABLE rate DROP FOREIGN KEY FK_DFEC3F3916068855');
        $this->addSql('ALTER TABLE rate DROP FOREIGN KEY FK_DFEC3F39FDB3798');
        $this->addSql('ALTER TABLE transport_order DROP FOREIGN KEY FK_6826346068563B78');
        $this->addSql('ALTER TABLE transport_order DROP FOREIGN KEY FK_682634604A7A3B5E');
        $this->addSql('ALTER TABLE transport_order DROP FOREIGN KEY FK_6826346016068855');
        $this->addSql('ALTER TABLE transport_order DROP FOREIGN KEY FK_68263460FDB3798');
        $this->addSql('DROP TABLE adress');
        $this->addSql('DROP TABLE carrier');
        $this->addSql('DROP TABLE country');
        $this->addSql('DROP TABLE destination_params');
        $this->addSql('DROP TABLE destination_params_carrier');
        $this->addSql('DROP TABLE initial_params');
        $this->addSql('DROP TABLE rate');
        $this->addSql('DROP TABLE transport_order');
        $this->addSql('DROP TABLE user');
        $this->addSql('DROP TABLE vehicle');
        $this->addSql('DROP TABLE warehouse');
    }
}
