import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: String(process.env.HOST),
  port: 5432,
  username: String(process.env.USER),
  password: String(process.env.PASSWORD),
  database: String(process.env.DB),
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
};

export default config;
