/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from '../src/app.service';
import { ScraperService } from '../src/scraper/scraper.service';

describe('AppService', () => {
  let service: AppService;
  let scraperService: ScraperService;

  const mockScraperService = {
    scrape: jest.fn(),
    getAvailableRules: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        { provide: ScraperService, useValue: mockScraperService },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
    scraperService = module.get<ScraperService>(ScraperService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('scrape', () => {
    it('should call scraper service with correct parameters', async () => {
      const request = {
        url: 'https://example.com',
        ruleName: 'testRule',
      };
      const expectedResult = { success: true, data: 'test' };

      mockScraperService.scrape.mockResolvedValue(expectedResult);

      const result = await service.scrape(request);

      expect(scraperService.scrape).toHaveBeenCalledWith(request);
      expect(result).toBe(expectedResult);
    });
  });

  describe('getAvailableRules', () => {
    it('should return available rules from scraper service', () => {
      const mockRules = ['rule1', 'rule2'];
      mockScraperService.getAvailableRules.mockReturnValue(mockRules);

      const rules = service.getAvailableRules();

      expect(scraperService.getAvailableRules).toHaveBeenCalled();
      expect(rules).toBe(mockRules);
    });
  });
});
