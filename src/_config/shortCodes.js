/**
 * @param {import('@11ty/eleventy/UserConfig').default} eleventyConfig 
 */
export default function(eleventyConfig) {
  eleventyConfig.addShortcode('currentYear', () => {
    return Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(new Date());
  });

  /**
   * @param {string} date -- ISO date string
   * @returns {string}
   */
  eleventyConfig.addShortcode('ogImage', (date) => {
    const monthDay = new Date(date).getDate();
    return `/social/ogImage-${(monthDay % 5) + 1}`;
  })
}
