import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1740552392470 implements MigrationInterface {
    name = 'CreateTables1740552392470'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ApplicationForm\` ADD \`phoneNumber\` varchar(30) NOT NULL`);
        await queryRunner.query(`DROP INDEX \`pagination_Index\` ON \`posts\``);
        await queryRunner.query(`ALTER TABLE \`posts\` CHANGE \`language\` \`language\` enum ('korean', 'english', 'japanese') NOT NULL DEFAULT 'korean'`);
        await queryRunner.query(`ALTER TABLE \`Banner\` CHANGE \`language\` \`language\` enum ('korean', 'english', 'japanese') NOT NULL DEFAULT 'korean'`);
        await queryRunner.query(`CREATE INDEX \`pagination_Index\` ON \`posts\` (\`category\`, \`language\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`pagination_Index\` ON \`posts\``);
        await queryRunner.query(`ALTER TABLE \`Banner\` CHANGE \`language\` \`language\` enum ('korean', 'english', 'chinese') NOT NULL DEFAULT 'korean'`);
        await queryRunner.query(`ALTER TABLE \`posts\` CHANGE \`language\` \`language\` enum ('korean', 'english', 'chinese') NOT NULL DEFAULT 'korean'`);
        await queryRunner.query(`CREATE INDEX \`pagination_Index\` ON \`posts\` (\`category\`, \`language\`)`);
        await queryRunner.query(`ALTER TABLE \`ApplicationForm\` DROP COLUMN \`phoneNumber\``);
    }

}
