import { Module } from '@nestjs/common';
import { NewsController } from './news.controller.js';
import { NewsRepository } from './news.repository.js';
import { NewsService } from './news.service.js';


@Module({
  controllers: [NewsController],
  providers: [NewsService, NewsRepository],
})
export class NewsModule {}
