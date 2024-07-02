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
  imports: [ TypeOrmModule.forRoot({
    type: "postgres",
    host: 'dpg-cq215ltds78s73esdkm0-a.frankfurt-postgres.render.com',
    port: 5432,
    username: 'user_db_zdpm_user',
    password: 'ef6sqfRPTS4bSx1J2M0MlBAMuAjnuJJ8',
    database: 'user_db_zdpm',
    entities: [User],
    ssl:true,
    synchronize: true,
  }),
  TypeOrmModule.forFeature([User]),
   ConfigModule.forRoot({ isGlobal: true }), 
    UserModule],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule {}
