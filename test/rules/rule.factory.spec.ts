/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */
import { RuleFactory } from '../../src/rules/rule.factory';
import { LinkedInJobPositionsRule } from '../../src/rules/linkedin-job-positions.rule';
import { ScrapingRule } from '../../src/rules/rule.interface';

class MockRule implements ScrapingRule {
  name = 'mockRule';
  async execute(html: string): Promise<any> {
    return { mock: 'data' };
  }
}

describe('RuleFactory', () => {
  beforeEach(() => {
    // Limpiar instancia singleton para tests
    (RuleFactory as any).rules.clear();
  });

  describe('getAvailableRules', () => {
    it('should return empty array when no rules registered', () => {
      const rules = RuleFactory.getAvailableRules();
      expect(rules).toEqual([]);
    });

    it('should return registered rule names', () => {
      RuleFactory.registerRule(new LinkedInJobPositionsRule());
      RuleFactory.registerRule(new MockRule());

      const rules = RuleFactory.getAvailableRules();
      expect(rules).toContain('linkedinJobPositions');
      expect(rules).toContain('mockRule');
    });
  });

  describe('getRule', () => {
    it('should return registered rule', () => {
      const linkedinRule = new LinkedInJobPositionsRule();
      RuleFactory.registerRule(linkedinRule);

      const rule = RuleFactory.getRule('linkedinJobPositions');
      expect(rule).toBe(linkedinRule);
      expect(rule.name).toBe('linkedinJobPositions');
    });

    it('should throw error for non-existent rule', () => {
      expect(() => {
        RuleFactory.getRule('nonExistentRule');
      }).toThrow("Rule 'nonExistentRule' not found");
    });
  });

  describe('registerRule', () => {
    it('should register a new rule', () => {
      const mockRule = new MockRule();

      RuleFactory.registerRule(mockRule);

      const rule = RuleFactory.getRule('mockRule');
      expect(rule).toBe(mockRule);
    });

    it('should overwrite existing rule with same name', () => {
      const firstRule = new MockRule();
      const secondRule = new MockRule();
      secondRule.name = 'mockRule'; // Mismo nombre

      RuleFactory.registerRule(firstRule);
      RuleFactory.registerRule(secondRule);

      const rule = RuleFactory.getRule('mockRule');
      expect(rule).toBe(secondRule);
    });
  });
});
