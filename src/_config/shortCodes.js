/**
 * @param {import('@11ty/eleventy/UserConfig').default} eleventyConfig 
 */
export default function(eleventyConfig) {
  eleventyConfig.addShortcode('currentYear', function addShortcode() {
    return Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(new Date());
  });

  /**
   * @param {string} imagePath -- path to the image
   * @param {string} pageUrl -- page.url property; used if `imagePath` does not start with a slash 
   * @returns {string}
   */
  eleventyConfig.addShortcode('ogImage', function ogImage(imagePath, pageUrl) {
    if (imagePath.startsWith('/')) {
      return imagePath;
    }

    return `${pageUrl}${imagePath}`;
  });

  /**
   * @param {string | Date} date -- ISO date string
   * @returns {string}
   */
  eleventyConfig.addShortcode('fallbackOgImage', function fallbackOgImage(date) {
    const num = (new Date(date).getDate() % 5) + 1;

    return `/social/ogImage-${num}.png`;
  });
}
