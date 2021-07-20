import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './models/users/users.module';
import { PosgresDatabaseProviderModule } from './providers/database/postgres/provider.module';

@Module({
  imports: [ConfigModule.forRoot(), PosgresDatabaseProviderModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
