import {
  Controller,
  Post,
  Body,
  Get,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ScrapingRequestDto } from './dto/scraping-request.dto';

@Controller('scrape')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  async scrape(@Body() scrapingRequest: ScrapingRequestDto) {
    // Ahora scrapingRequest es una instancia de ScrapingRequestDto
    // con las validaciones aplicadas
    return this.appService.scrape(scrapingRequest);
  }

  @Get('rules')
  getAvailableRules() {
    return this.appService.getAvailableRules();
  }
}
