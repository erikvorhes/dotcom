const rssPlugin = require('@11ty/eleventy-plugin-rss');
const pluginSyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');

const {dateFilter, fullDateFilter, schedulePubDateFilter, w3cDateFilter} = require('./src/filters/date-filters.js');
const markdownFilter = require('./src/filters/markdown-filter.js');
const taglistFilter = require('./src/filters/taglist-filter.js');

const htmlMinTransform = require('./src/transforms/html-min-transform.js');
const parseTransform = require('./src/transforms/parse-transform.js');

// const site = require('./src/_data/site.json');

/**
 * @param {import("@11ty/eleventy").UserConfig} eleventyConfig
 */
module.exports = function(eleventyConfig) {
  const currentDate = new Date();
  const isFutureItem = (dateString) => currentDate < new Date(dateString);

  eleventyConfig.addFilter('dateFilter', dateFilter);
  eleventyConfig.addFilter('fullDateFilter', fullDateFilter);
  eleventyConfig.addFilter('markdownFilter', markdownFilter);
  eleventyConfig.addFilter('schedulePubDateFilter', schedulePubDateFilter);
  eleventyConfig.addFilter('taglistFilter', taglistFilter);
  eleventyConfig.addFilter('w3cDateFilter', w3cDateFilter);

  eleventyConfig.addNunjucksShortCode('currentYear', function() {
    return currentDate.getFullYear();
  });

  eleventyConfig.addLayoutAlias('home', './src/_includes/layouts/home.njk');
  eleventyConfig.addLayoutAlias('content', './src/_includes/layouts/page.njk');
  eleventyConfig.addLayoutAlias('note', './src/_includes/layouts/note.njk');

  eleventyConfig.addTransform('htmlmin', htmlMinTransform);
  eleventyConfig.addTransform('parse', parseTransform);

  eleventyConfig.addPassthroughCopy('./src/files');
  eleventyConfig.addPassthroughCopy('./src/images');
  eleventyConfig.addPassthroughCopy('./src/js');
  // eleventyConfig.addPassthroughCopy('./node_modules/nunjucks/browser/nunjucks-slim.js');

  eleventyConfig.addCollection('notes', collection => {
    return [...collection.getFilteredByGlob('./src/notes/*.md')]
      .filter(item => !isFutureItem(item.date))
      .reverse();
  });

  eleventyConfig.addCollection('feedNotes', collection => {
    return [...collection.getFilteredByGlob('./src/notes/*.md')]
      .filter(item => !isFutureItem(item.date))
      .reverse()
      .slice(0, site.maxPostsPerPage);
  });

  eleventyConfig.addCollection('tagList', collection => {
    const tagSet = new Set();
    collection.getAll().forEach(item => {
      (item.data.tags || []).forEach(tag => {
        tagSet.add(tag)
      })
    });

    return taglistFilter(Array.from(tagSet));
  });

  eleventyConfig.addCollection('natureLiteratureHandouts', collection => {
    return collection.getFilteredByTags('notes', 'nature-literature', 'class-handout')
  });

  eleventyConfig.addCollection('natureLiteratureSchedule', collection => {
    return collection.getFilteredByGlob('./src/was/teaching/nature-literature/sessions/*.md');
  });

  eleventyConfig.addCollection('shakespeareHandouts', collection => {
    return collection.getFilteredByTags('notes', 'shakespeare', 'class-handout')
  });

  eleventyConfig.addCollection('shakespeareSchedule', collection => {
    return collection.getFilteredByGlob('./src/was/teaching/shakespeare/sessions/*.md');
  });

  eleventyConfig.addCollection('writingOneHandouts', collection => {
    return collection.getFilteredByTags('notes', 'writing-1', 'class-handout')
  });

  eleventyConfig.addCollection('writingOneSchedule', collection => {
    return collection.getFilteredByGlob('./src/was/teaching/writing-1/sessions/*.md');
  });

  eleventyConfig.addCollection('writingSeminarHandouts', collection => {
    return collection.getFilteredByTags('notes', 'writing-seminar', 'class-handout')
  });

  eleventyConfig.addCollection('writingSeminarSchedule', collection => {
    return collection.getFilteredByGlob('./src/was/teaching/writing-seminar/sessions/*.md');
  });

  eleventyConfig.addCollection('writingTwoHandouts', collection => {
    return collection.getFilteredByTags('notes', 'writing-2', 'class-handout')
  });

  eleventyConfig.addCollection('writingTwoSchedule', collection => {
    return collection.getFilteredByGlob('./src/was/teaching/writing-2/sessions/*.md');
  });

  eleventyConfig.addPlugin(pluginSyntaxHighlight);
  eleventyConfig.addPlugin(rssPlugin);

  return {
    dir: {
      input: 'src',
      output: 'dist'
    }
  };
};
