/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { ScraperService } from './scraper/scraper.service';
import { ScrapingResponse, ScrapingRequest } from './rules/rule.interface';
import { ScrapingRequestDto } from './dto/scraping-request.dto';

@Injectable()
export class AppService {
  constructor(private readonly scraperService: ScraperService) {}

  async scrape(requestDto: ScrapingRequestDto): Promise<ScrapingResponse> {
    // Convertir el DTO a la interfaz ScrapingRequest
    const request: ScrapingRequest = {
      url: requestDto.url,
      ruleName: requestDto.ruleName,
      options: requestDto.options,
    };

    return this.scraperService.scrape(request);
  }

  getAvailableRules(): string[] {
    return this.scraperService.getAvailableRules();
  }
}
