import { DataSource } from "typeorm";
// npm run typeorm migration:generate ./src/migrations/CreateTables -- -d /app/src/ormconfig.ts
// npm run typeorm migration:run -- -d ./src/ormconfig.ts 
export const AppDataSource = new DataSource({
    type:'mysql',
    host: process.env.DB_HOST,
    port: 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [__dirname+'/**/*.entity.ts'],
    synchronize: false,
    migrations: [__dirname, '/**/migrations/*.ts'],
    migrationsTableName: 'migrations'
})