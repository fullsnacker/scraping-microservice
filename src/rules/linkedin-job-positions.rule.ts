/* eslint-disable @typescript-eslint/require-await */
import * as cheerio from 'cheerio';
import { ScrapingRule } from './rule.interface';

export class LinkedInJobPositionsRule implements ScrapingRule {
  name = 'linkedinJobPositions';

  async execute(html: string): Promise<any> {
    const $ = cheerio.load(html);
    const jobPositions: any[] = [];

    // Extract information about job positions
    $('.base-search-card').each((index, element) => {
      const $element = $(element);

      const title = $element.find('.base-search-card__title').text().trim();
      const company = $element
        .find('.base-search-card__subtitle')
        .text()
        .trim();
      const location = $element
        .find('.job-search-card__location')
        .text()
        .trim();
      const date = $element.find('time').attr('datetime') || '';

      const formattedDate = date
        ? new Date(date).toLocaleDateString('es-AR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })
        : '';

      // Get job link

      const link = $element.find('.base-card__full-link').attr('href') || '';

      if (title) {
        jobPositions.push({
          title,
          company,
          location,
          formattedDate,
          link: link.split('?')[0], // Clean URL without tracking params
          position: index + 1,
        });
      }
    });

    return {
      totalResults: jobPositions.length,
      jobPositions,
    };
  }
}
