/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { ScraperService } from '../../src/scraper/scraper.service';
import { RuleFactory } from '../../src/rules/rule.factory';
import { LinkedInJobPositionsRule } from '../../src/rules/linkedin-job-positions.rule';

// Mock Rule
class MockRule {
  name = 'mockRule';
  execute = jest.fn();
}

// Mock HttpService
const mockHttpService = {
  get: jest.fn(),
};

describe('ScraperService', () => {
  let service: ScraperService;
  let httpService: HttpService;
  let mockRule: MockRule;

  beforeEach(async () => {
    // Limpiar factory antes de cada test
    (RuleFactory as any).rules.clear();

    mockRule = new MockRule();
    RuleFactory.registerRule(mockRule as any);

    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        ScraperService,
        { provide: HttpService, useValue: mockHttpService },
      ],
    }).compile();

    service = module.get<ScraperService>(ScraperService);
    httpService = module.get<HttpService>(HttpService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(httpService).toBeDefined();
  });

  describe('scrape', () => {
    it('should successfully scrape with valid rule', async () => {
      const mockHtml = '<html>Mock HTML</html>';
      const mockData = { success: true, data: 'processed' };

      // Mock successful HTTP response
      mockHttpService.get.mockReturnValue(
        of({
          data: mockHtml,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {},
        }),
      );

      mockRule.execute.mockResolvedValue(mockData);

      const request = {
        url: 'https://example.com',
        ruleName: 'mockRule',
      };

      const result = await service.scrape(request);

      expect(mockHttpService.get).toHaveBeenCalledWith('https://example.com', {
        timeout: 30000,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
      });

      expect(mockRule.execute).toHaveBeenCalledWith(mockHtml);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockData);
      expect(result.timestamp).toBeInstanceOf(Date);
    });

    it('should throw error for non-existent rule', async () => {
      const request = {
        url: 'https://example.com',
        ruleName: 'nonExistentRule',
      };

      await expect(service.scrape(request)).rejects.toThrow(HttpException);

      const error = await service.scrape(request).catch((err) => err);
      expect(error.getResponse()).toEqual({
        success: false,
        error: expect.stringContaining('Rule not found'),
        timestamp: expect.any(Date),
      });
      expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should handle HTTP errors', async () => {
      // Mock HTTP error
      mockHttpService.get.mockReturnValue(
        throwError(() => new Error('Network error')),
      );

      const request = {
        url: 'https://example.com',
        ruleName: 'mockRule',
      };

      await expect(service.scrape(request)).rejects.toThrow(HttpException);

      const error = await service.scrape(request).catch((err) => err);
      expect(error.getResponse()).toEqual({
        success: false,
        error: 'Network error',
        timestamp: expect.any(Date),
      });
    });

    it('should handle rule execution errors', async () => {
      const mockHtml = '<html>Mock HTML</html>';

      mockHttpService.get.mockReturnValue(
        of({
          data: mockHtml,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {},
        }),
      );

      mockRule.execute.mockRejectedValue(new Error('Rule execution failed'));

      const request = {
        url: 'https://example.com',
        ruleName: 'mockRule',
      };

      await expect(service.scrape(request)).rejects.toThrow(HttpException);

      const error = await service.scrape(request).catch((err) => err);
      expect(error.getResponse()).toEqual({
        success: false,
        error: 'Rule execution failed',
        timestamp: expect.any(Date),
      });
    });

    it('should handle 404 responses', async () => {
      mockHttpService.get.mockReturnValue(
        throwError(() => ({
          response: {
            status: 404,
            statusText: 'Not Found',
            data: 'Page not found',
          },
        })),
      );

      const request = {
        url: 'https://example.com/invalid',
        ruleName: 'mockRule',
      };

      await expect(service.scrape(request)).rejects.toThrow(HttpException);
    });
  });

  describe('getAvailableRules', () => {
    it('should return available rules', () => {
      RuleFactory.registerRule(new LinkedInJobPositionsRule());
      RuleFactory.registerRule(mockRule as any);

      const rules = service.getAvailableRules();

      expect(rules).toContain('linkedinJobPositions');
      expect(rules).toContain('mockRule');
      expect(rules.length).toBe(2);
    });

    it('should return empty array when no rules registered', () => {
      // Limpiar reglas
      (RuleFactory as any).rules.clear();

      const rules = service.getAvailableRules();

      expect(rules).toEqual([]);
    });
  });
});
