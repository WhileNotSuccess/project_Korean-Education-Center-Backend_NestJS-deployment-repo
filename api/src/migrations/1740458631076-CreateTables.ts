import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1740458631076 implements MigrationInterface {
    name = 'CreateTables1740458631076'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`posts\` DROP FOREIGN KEY \`fk_user_id\``);
        await queryRunner.query(`ALTER TABLE \`posts\` CHANGE \`userId\` \`userId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`posts\` ADD CONSTRAINT \`FK_ae05faaa55c866130abef6e1fee\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`posts\` DROP FOREIGN KEY \`FK_ae05faaa55c866130abef6e1fee\``);
        await queryRunner.query(`ALTER TABLE \`posts\` CHANGE \`userId\` \`userId\` int NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`posts\` ADD CONSTRAINT \`fk_user_id\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
