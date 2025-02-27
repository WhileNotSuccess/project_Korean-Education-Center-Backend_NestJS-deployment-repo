import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1740656261572 implements MigrationInterface {
    name = 'CreateTables1740656261572'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`posts\` DROP COLUMN \`expiredDate\``);
        await queryRunner.query(`ALTER TABLE \`course\` DROP COLUMN \`Korean\``);
        await queryRunner.query(`ALTER TABLE \`course\` DROP COLUMN \`Japanese\``);
        await queryRunner.query(`ALTER TABLE \`course\` DROP COLUMN \`English\``);
        await queryRunner.query(`ALTER TABLE \`course\` ADD \`korean\` varchar(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`course\` ADD \`japanese\` varchar(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`course\` ADD \`english\` varchar(20) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`course\` DROP COLUMN \`english\``);
        await queryRunner.query(`ALTER TABLE \`course\` DROP COLUMN \`japanese\``);
        await queryRunner.query(`ALTER TABLE \`course\` DROP COLUMN \`korean\``);
        await queryRunner.query(`ALTER TABLE \`course\` ADD \`English\` varchar(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`course\` ADD \`Japanese\` varchar(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`course\` ADD \`Korean\` varchar(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`posts\` ADD \`expiredDate\` datetime NULL`);
    }

}
