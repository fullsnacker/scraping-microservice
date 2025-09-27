/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { RuleFactory } from '../rules/rule.factory';
import { ScrapingRequest, ScrapingResponse } from '../rules/rule.interface';

@Injectable()
export class ScraperService {
  private readonly axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      timeout: 30000,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });
  }

  async scrape(request: ScrapingRequest): Promise<ScrapingResponse> {
    try {
      // Validate rule name
      const availableRules = RuleFactory.getAvailableRules();
      if (!availableRules.includes(request.ruleName)) {
        throw new Error(
          `Rule not found. Available rules: ${availableRules.join(', ')}`,
        );
      }

      // Make HTTP request to fetch the HTML content
      const response = await this.axiosInstance.get(request.url);

      // Execute the scraping rule
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
