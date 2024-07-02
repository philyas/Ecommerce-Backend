import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), 
    TypeOrmModule.forRoot({
    type: "postgres",
    host: String(process.env.HOST),
    port: 5432,
    username: String(process.env.USER),
    password: String(process.env.PASSWORD),
    database: String(process.env.DB),
    entities: [User],
    ssl:true,
    synchronize: true,
  }),
  TypeOrmModule.forFeature([User]),
    UserModule],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule {}
