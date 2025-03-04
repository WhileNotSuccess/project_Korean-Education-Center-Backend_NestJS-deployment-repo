import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1741052904538 implements MigrationInterface {
    name = 'CreateTables1741052904538'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ApplicationForm\` ADD CONSTRAINT \`FK_8b4c6238fbbf02d3b1d91bb830b\` FOREIGN KEY (\`courseId\`) REFERENCES \`course\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ApplicationForm\` DROP FOREIGN KEY \`FK_8b4c6238fbbf02d3b1d91bb830b\``);
    }

}
