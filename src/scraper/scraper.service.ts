/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { RuleFactory } from '../rules/rule.factory';
import { ScrapingRequest, ScrapingResponse } from '../rules/rule.interface';

@Injectable()
export class ScraperService {
  constructor(private readonly httpService: HttpService) {}

  async scrape(request: ScrapingRequest): Promise<ScrapingResponse> {
    try {
      // Validar que la regla exista
      const availableRules = RuleFactory.getAvailableRules();
      if (!availableRules.includes(request.ruleName)) {
        throw new Error(
          `Rule not found. Available rules: ${availableRules.join(', ')}`,
        );
      }

      // Hacer la petición HTTP usando HttpService de NestJS
      const response = await firstValueFrom(
        this.httpService.get(request.url, {
          timeout: 30000,
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          },
        }),
      );

      // Ejecutar la regla específica
      const rule = RuleFactory.getRule(request.ruleName);
      const data = await rule.execute(response.data);

      return {
        success: true,
        data,
        timestamp: new Date(),
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: error.message,
          timestamp: new Date(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  getAvailableRules(): string[] {
    return RuleFactory.getAvailableRules();
  }
}
