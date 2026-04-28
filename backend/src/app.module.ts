import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TestController } from './test/test.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '13524609',
      database: 'citycare',
      autoLoadEntities: true,
      synchronize: true, // dev only
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController, TestController],
  providers: [AppService],
})
export class AppModule {}
