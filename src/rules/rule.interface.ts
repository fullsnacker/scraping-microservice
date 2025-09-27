export interface ScrapingRule {
  name: string;
  execute(html: string): Promise<any>;
}

export interface ScrapingRequest {
  url: string;
  ruleName: string;
  options?: any;
}

export interface ScrapingResponse {
  success: boolean;
  data?: any;
  error?: string;
  timestamp: Date;
}
