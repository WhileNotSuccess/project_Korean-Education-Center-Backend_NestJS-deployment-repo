import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1740641389399 implements MigrationInterface {
    name = 'CreateTables1740641389399'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`course\` DROP COLUMN \`name\``);
        await queryRunner.query(`ALTER TABLE \`course\` ADD \`Korean\` varchar(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`course\` ADD \`Japanese\` varchar(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`course\` ADD \`English\` varchar(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`ApplicationForm\` DROP COLUMN \`course\``);
        await queryRunner.query(`ALTER TABLE \`ApplicationForm\` ADD \`course\` int NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ApplicationForm\` DROP COLUMN \`course\``);
        await queryRunner.query(`ALTER TABLE \`ApplicationForm\` ADD \`course\` varchar(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`course\` DROP COLUMN \`English\``);
        await queryRunner.query(`ALTER TABLE \`course\` DROP COLUMN \`Japanese\``);
        await queryRunner.query(`ALTER TABLE \`course\` DROP COLUMN \`Korean\``);
        await queryRunner.query(`ALTER TABLE \`course\` ADD \`name\` varchar(20) NOT NULL`);
    }

}
