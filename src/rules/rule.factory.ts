import { ScrapingRule } from './rule.interface';
import { LinkedInJobPositionsRule } from './linkedin-job-positions.rule';

export class RuleFactory {
  private static rules: Map<string, ScrapingRule> = new Map();

  static {
    this.registerRule(new LinkedInJobPositionsRule());
    // this.registerRule(new AnotherRule());
  }

  static registerRule(rule: ScrapingRule): void {
    this.rules.set(rule.name, rule);
  }

  static getRule(ruleName: string): ScrapingRule {
    const rule = this.rules.get(ruleName);
    if (!rule) {
      throw new Error(`Rule '${ruleName}' not found`);
    }
    return rule;
  }

  static getAvailableRules(): string[] {
    return Array.from(this.rules.keys());
  }
}
