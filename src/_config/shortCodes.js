/**
 * @param {import('@11ty/eleventy/UserConfig').default} eleventyConfig 
 */
export default function(eleventyConfig) {
  eleventyConfig.addShortcode('currentYear', () => {
    return Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(new Date());
  });
}
