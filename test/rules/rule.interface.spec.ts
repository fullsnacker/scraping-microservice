/* eslint-disable @typescript-eslint/unbound-method */
import {
  ScrapingRule,
  ScrapingRequest,
  ScrapingResponse,
} from '../../src/rules/rule.interface';

describe('Rule Interfaces', () => {
  describe('ScrapingRule', () => {
    it('should have required properties', () => {
      const mockRule: ScrapingRule = {
        name: 'testRule',
        execute: jest.fn(),
      };

      expect(mockRule.name).toBeDefined();
      expect(mockRule.execute).toBeDefined();
    });
  });

  describe('ScrapingRequest', () => {
    it('should have url and ruleName properties', () => {
      const request: ScrapingRequest = {
        url: 'https://example.com',
        ruleName: 'testRule',
      };

      expect(request.url).toBe('https://example.com');
      expect(request.ruleName).toBe('testRule');
    });

    it('should allow optional options', () => {
      const request: ScrapingRequest = {
        url: 'https://example.com',
        ruleName: 'testRule',
        options: { timeout: 5000 },
      };

      expect(request.options).toEqual({ timeout: 5000 });
    });
  });

  describe('ScrapingResponse', () => {
    it('should have success and timestamp properties', () => {
      const timestamp = new Date();
      const response: ScrapingResponse = {
        success: true,
        data: { test: 'data' },
        timestamp,
      };

      expect(response.success).toBe(true);
      expect(response.data).toEqual({ test: 'data' });
      expect(response.timestamp).toBe(timestamp);
    });

    it('should allow error property', () => {
      const response: ScrapingResponse = {
        success: false,
        error: 'Test error',
        timestamp: new Date(),
      };

      expect(response.success).toBe(false);
      expect(response.error).toBe('Test error');
    });
  });
});
