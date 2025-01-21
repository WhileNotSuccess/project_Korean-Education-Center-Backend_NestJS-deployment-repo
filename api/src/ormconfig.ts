import { DataSource } from "typeorm";
// npm run typeorm migration:generate ./src/migrations/CreateTables -- -d /app/src/ormconfig.ts
// npm run typeorm migration:run -- -d ./src/ormconfig.ts 
export const AppDataSource = new DataSource({
    type:'mysql',
    host: process.env.MYSQL_SERVER,
    port: +process.env.MYSQL_PORT,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    entities: [__dirname+'/**/*.entity.ts'],
    synchronize: false,
    migrations: [__dirname, '/**/migrations/*.ts'],
    migrationsTableName: 'migrations'
})