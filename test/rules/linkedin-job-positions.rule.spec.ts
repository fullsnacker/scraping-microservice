/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { LinkedInJobPositionsRule } from '../../src/rules/linkedin-job-positions.rule';

describe('LinkedInJobPositionsRule', () => {
  let rule: LinkedInJobPositionsRule;

  beforeEach(() => {
    rule = new LinkedInJobPositionsRule();
  });

  it('should be defined', () => {
    expect(rule).toBeDefined();
  });

  it('should have correct name', () => {
    expect(rule.name).toBe('linkedinJobPositions');
  });

  describe('execute', () => {
    it('should extract job positions from HTML', async () => {
      const mockHtml = `
        <div class="base-search-card">
          <h3 class="base-search-card__title">Senior React Developer</h3>
          <h4 class="base-search-card__subtitle">Tech Company</h4>
          <span class="job-search-card__location">Buenos Aires, Argentina</span>
          <time class="job-search-card__listdate">Hace 1 día</time>
          <a class="base-card__full-link" href="https://linkedin.com/jobs/view/123?refId=abc"></a>
        </div>
        <div class="base-search-card">
          <h3 class="base-search-card__title">Frontend Developer</h3>
          <h4 class="base-search-card__subtitle">Startup Inc</h4>
          <span class="job-search-card__location">Remote</span>
          <time class="job-search-card__listdate">Hace 2 días</time>
          <a class="base-card__full-link" href="https://linkedin.com/jobs/view/456?refId=def"></a>
        </div>
      `;

      const result = await rule.execute(mockHtml);

      expect(result.totalResults).toBe(2);
      expect(result.jobPositions).toHaveLength(2);

      expect(result.jobPositions[0]).toEqual({
        title: 'Senior React Developer',
        company: 'Tech Company',
        location: 'Buenos Aires, Argentina',
        date: 'Hace 1 día',
        link: 'https://linkedin.com/jobs/view/123',
        position: 1,
      });

      expect(result.jobPositions[1].title).toBe('Frontend Developer');
      expect(result.jobPositions[1].link).toBe(
        'https://linkedin.com/jobs/view/456',
      );
    });

    it('should handle empty HTML', async () => {
      const result = await rule.execute('<html><body></body></html>');

      expect(result.totalResults).toBe(0);
      expect(result.jobPositions).toHaveLength(0);
    });

    it('should handle HTML without job cards', async () => {
      const html =
        '<html><body><div class="other-class">Content</div></body></html>';

      const result = await rule.execute(html);

      expect(result.totalResults).toBe(0);
      expect(result.jobPositions).toHaveLength(0);
    });

    it('should handle missing fields gracefully', async () => {
      const mockHtml = `
        <div class="base-search-card">
          <h3 class="base-search-card__title">Job Title Only</h3>
          <!-- Missing other fields -->
        </div>
      `;

      const result = await rule.execute(mockHtml);

      expect(result.totalResults).toBe(1);
      expect(result.jobPositions[0]).toEqual({
        title: 'Job Title Only',
        company: '',
        location: '',
        date: '',
        link: '',
        position: 1,
      });
    });
  });
});
