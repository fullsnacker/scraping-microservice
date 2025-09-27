import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScraperService } from './scraper/scraper.service';

@Module({
  imports: [HttpModule], // ← Agregar HttpModule
  controllers: [AppController],
  providers: [AppService, ScraperService],
})
export class AppModule {}
