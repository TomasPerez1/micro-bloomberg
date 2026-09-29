import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module.js';
import { HealthController } from './health/health.controller.js';
import { NewsModule } from './news/news.module.js';
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}), 
    DatabaseModule, 
    NewsModule
  ],
  controllers: [HealthController],
})
export class AppModule {}
