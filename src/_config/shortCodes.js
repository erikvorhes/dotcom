/**
 * @param {import('@11ty/eleventy/UserConfig').default} eleventyConfig 
 */
export default function(eleventyConfig) {
  eleventyConfig.addShortcode('currentYear', () => {
    return Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(new Date());
  });

  /**
   * @param {string | Date} date -- ISO date string
   * @returns {string}
   */
  eleventyConfig.addShortcode('ogImage', (date) => {
    const num = (new Date(date).getDate() % 5) + 1;
    const ext = num > 3 ? 'jpeg' : 'png';

    return `/social/ogImage-${num}.${ext}`;
  })
}
