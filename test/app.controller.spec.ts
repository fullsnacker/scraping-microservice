/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';

describe('AppController', () => {
  let controller: AppController;
  let service: AppService;

  const mockAppService = {
    scrape: jest.fn(),
    getAvailableRules: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: AppService, useValue: mockAppService }],
    }).compile();

    controller = module.get<AppController>(AppController);
    service = module.get<AppService>(AppService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('scrape', () => {
    it('should call app service scrape method', async () => {
      const request = {
        url: 'https://example.com',
        ruleName: 'testRule',
      };
      const expectedResult = { success: true, data: 'test' };

      mockAppService.scrape.mockResolvedValue(expectedResult);

      const result = await controller.scrape(request);

      expect(service.scrape).toHaveBeenCalledWith(request);
      expect(result).toBe(expectedResult);
    });
  });

  describe('getAvailableRules', () => {
    it('should return available rules from app service', () => {
      const mockRules = ['rule1', 'rule2'];
      mockAppService.getAvailableRules.mockReturnValue(mockRules);

      const result = controller.getAvailableRules();

      expect(service.getAvailableRules).toHaveBeenCalled();
      expect(result).toBe(mockRules);
    });
  });
});
