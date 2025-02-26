import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1740482869912 implements MigrationInterface {
    name = 'CreateTables1740482869912'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`ApplicationAttachment\` (\`id\` int NOT NULL AUTO_INCREMENT, \`applicationId\` int NOT NULL, \`filename\` varchar(100) NOT NULL, \`filetype\` varchar(75) NOT NULL, \`fileSize\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`ApplicationForm\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NOT NULL, \`course\` varchar(20) NOT NULL, \`createdDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`isDone\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`attachment\` (\`id\` int NOT NULL AUTO_INCREMENT, \`postId\` int NOT NULL, \`filename\` varchar(100) NOT NULL, \`fileType\` varchar(75) NOT NULL, \`fileSize\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`posts\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(100) NOT NULL, \`content\` longtext NOT NULL, \`userId\` int NOT NULL, \`category\` varchar(25) NOT NULL, \`createdDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`language\` enum ('korean', 'english', 'chinese') NOT NULL DEFAULT 'korean', \`expiredDate\` datetime NULL, INDEX \`pagination_Index\` (\`category\`, \`language\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`password\` varchar(60) NULL, \`email\` varchar(100) NOT NULL, \`googleId\` varchar(22) NULL, \`emailVerifiedAt\` datetime NULL, \`signUpVerifyToken\` varchar(36) NOT NULL, UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`staff\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`position\` varchar(50) NOT NULL, \`phone\` varchar(13) NOT NULL, \`email\` varchar(100) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`course\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(20) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`consultation_request\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(100) NOT NULL, \`schedule\` datetime NOT NULL, \`isDone\` tinyint NOT NULL DEFAULT 0, \`phone\` varchar(13) NOT NULL, \`name\` varchar(100) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Banner\` (\`id\` int NOT NULL AUTO_INCREMENT, \`image\` varchar(70) NOT NULL, \`language\` enum ('korean', 'english', 'chinese') NOT NULL DEFAULT 'korean', \`expiredDate\` datetime NOT NULL, \`url\` varchar(80) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`post_images\` (\`id\` int NOT NULL AUTO_INCREMENT, \`postId\` int NOT NULL, \`filename\` varchar(100) NOT NULL, \`fileSize\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`ApplicationAttachment\` ADD CONSTRAINT \`FK_2ca6eb753665f34291d2f96c84f\` FOREIGN KEY (\`applicationId\`) REFERENCES \`ApplicationForm\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ApplicationForm\` ADD CONSTRAINT \`FK_4de1a7c0fe79f9d15a94e473d52\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`attachment\` ADD CONSTRAINT \`FK_09f5bc45017ed4f20ad606985a0\` FOREIGN KEY (\`postId\`) REFERENCES \`posts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`posts\` ADD CONSTRAINT \`FK_ae05faaa55c866130abef6e1fee\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`post_images\` ADD CONSTRAINT \`FK_92e2382a7f43d4e9350d591fb6a\` FOREIGN KEY (\`postId\`) REFERENCES \`posts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post_images\` DROP FOREIGN KEY \`FK_92e2382a7f43d4e9350d591fb6a\``);
        await queryRunner.query(`ALTER TABLE \`posts\` DROP FOREIGN KEY \`FK_ae05faaa55c866130abef6e1fee\``);
        await queryRunner.query(`ALTER TABLE \`attachment\` DROP FOREIGN KEY \`FK_09f5bc45017ed4f20ad606985a0\``);
        await queryRunner.query(`ALTER TABLE \`ApplicationForm\` DROP FOREIGN KEY \`FK_4de1a7c0fe79f9d15a94e473d52\``);
        await queryRunner.query(`ALTER TABLE \`ApplicationAttachment\` DROP FOREIGN KEY \`FK_2ca6eb753665f34291d2f96c84f\``);
        await queryRunner.query(`DROP TABLE \`post_images\``);
        await queryRunner.query(`DROP TABLE \`Banner\``);
        await queryRunner.query(`DROP TABLE \`consultation_request\``);
        await queryRunner.query(`DROP TABLE \`course\``);
        await queryRunner.query(`DROP TABLE \`staff\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP INDEX \`pagination_Index\` ON \`posts\``);
        await queryRunner.query(`DROP TABLE \`posts\``);
        await queryRunner.query(`DROP TABLE \`attachment\``);
        await queryRunner.query(`DROP TABLE \`ApplicationForm\``);
        await queryRunner.query(`DROP TABLE \`ApplicationAttachment\``);
    }

}
