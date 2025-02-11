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
    //엔티티 지정
    synchronize: false,
    migrations: [__dirname, '/**/migrations/*.ts'],
    //실행할 마이그레이션 파일 지정
    // migration이라는 폴더안의 ts파일을 전부
    migrationsTableName: 'migrations'
    // 데이터베이스에 저장할 테이블 지정
    
})