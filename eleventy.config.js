const rssPlugin = require('@11ty/eleventy-plugin-rss');
const pluginSyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');

const {dateFilter, fullDateFilter, w3cDateFilter} = require('./src/filters/date-filters.js');
const taglistFilter = require('./src/filters/taglist-filter.js');

const htmlMinTransform = require('./src/transforms/html-min-transform.js');
const parseTransform = require('./src/transforms/parse-transform.js');

const mdIt = require('markdown-it')({
  html: true,
  linkify: true,
  typographer: true,
});

const mdItContainer = require('markdown-it-container');

mdIt.use(require('markdown-it-bracketed-spans'))
mdIt.use(require('markdown-it-attrs'));
mdIt.use(mdItContainer, 'verse'); // May add additional custom blocks, could be handy!
mdIt.use(require('markdown-it-ins'));
mdIt.use(require('markdown-it-deflist'));
mdIt.use(require('markdown-it-footnote'));

// change pre block so no code element is injected:
mdIt.renderer.rules.code_block = (tokens, idx, _, __, slf) => {
  const token = tokens[idx];

  return `<pre${slf.renderAttrs(token)}>${mdIt.utils.escapeHtml(token.content)}</pre>\n`
}

// fix footnote stuff
mdIt.renderer.rules.footnote_caption = (tokens, idx) => {
  let n = Number(tokens[idx].meta.id + 1).toString();

  if (tokens[idx].meta.subId > 0) {
    n += ':' + tokens[idx].meta.subId;
  }

  return `[<span class="visually-hidden">footnote </span>${n}]`;
}
mdIt.renderer.rules.footnote_ref = (tokens, idx, options, env, slf) => {
  const id = slf.rules.footnote_anchor_name(tokens, idx, options, env);
  const caption = slf.rules.footnote_caption(tokens, idx);
  let refid = id;

  if (tokens[idx].meta.subId > 0) {
    refid += ':' + tokens[idx].meta.subId;
  }

  return `<sup class="footnote__ref"><a href="#fn${id}" id="fnref${refid}">${caption}</a></sup>`
};
mdIt.renderer.rules.footnote_block_open = () => '<footer class="footnotes">\n<h2>Footnotes</h2>\n<ol>\n';
mdIt.renderer.rules.footnote_block_close = () => '</ol>\n</footer>\n';
mdIt.renderer.rules.footnote_open = (tokens, idx, options, env, slf) => {
  let id = slf.rules.footnote_anchor_name(tokens, idx, options, env);

  if (tokens[idx].meta.subId > 0) {
    id += ':' + tokens[idx].meta.subId;
  }

  return `<li id="fn${id}">`;
};
mdIt.renderer.rules.footnote_anchor = (tokens, idx, options, env, slf) => {
  let id = slf.rules.footnote_anchor_name(tokens, idx, options, env);

  if (tokens[idx].meta.subId > 0) {
    id += ':' + tokens[idx].meta.subId;
  }

  /* ↩ with escape code to prevent display as Apple Emoji on iOS */
  return ` <a href="#fnref${id}" class="footnote__backref"><span class="visually-hidden">back to link to footnote ${id}</span><span aria-hidden="true">\u21a9\uFE0E</span></a>`;
}

// const site = require('./src/_data/site.json');

/**
 * @param {import("@11ty/eleventy").UserConfig} eleventyConfig
 */
module.exports = function(eleventyConfig) {
  const currentDate = new Date();
  const isFutureItem = (dateString) => currentDate < new Date(dateString);

  eleventyConfig.addFilter('dateFilter', dateFilter);
  eleventyConfig.addFilter('fullDateFilter', fullDateFilter);
  eleventyConfig.addFilter('markdownFilter', (value) => mdIt.render(value));
  eleventyConfig.addFilter('taglistFilter', taglistFilter);
  eleventyConfig.addFilter('w3cDateFilter', w3cDateFilter);

  eleventyConfig.setLibrary('md', mdIt);
  eleventyConfig.amendLibrary('md', mdLib => mdLib.enable('code'));

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
    const endDate = new Date('2007-12-15');
    return collection
      .getFilteredByTags('notes', 'nature-literature', 'class-handout')
      .filter(item => new Date(item.date) <= endDate);
  });

  eleventyConfig.addCollection('natureLiteratureSchedule', collection => {
    return collection.getFilteredByGlob('./src/was/teaching/nature-literature/sessions/*.md');
  });

  eleventyConfig.addCollection('shakespeareHandouts', collection => {
    const endDate = new Date('2006-05-18')
    return collection
      .getFilteredByTags('notes', 'shakespeare', 'class-handout')
      .filter(item => new Date(item.date) <= endDate);
  });

  eleventyConfig.addCollection('shakespeareSchedule', collection => {
    return collection.getFilteredByGlob('./src/was/teaching/shakespeare/sessions/*.md');
  });

  eleventyConfig.addCollection('writingOneHandouts', collection => {
    const endDate = new Date('2003-12-11');
    return collection
      .getFilteredByTags('notes', 'writing-1', 'class-handout')
      .filter(item => new Date(item.date) <= endDate);
  });

  eleventyConfig.addCollection('writingOneSchedule', collection => {
    return collection.getFilteredByGlob('./src/was/teaching/writing-1/sessions/*.md');
  });

  eleventyConfig.addCollection('writingSeminarHandouts', collection => {
    const endDate = new Date('2007-12-15');
    return collection
      .getFilteredByTags('notes', 'writing-seminar', 'class-handout')
      .filter(item => new Date(item.date) <= endDate);
  });

  eleventyConfig.addCollection('writingSeminarSchedule', collection => {
    return collection.getFilteredByGlob('./src/was/teaching/writing-seminar/sessions/*.md');
  });

  eleventyConfig.addCollection('writingTwoHandouts', collection => {
    const endDate = new Date('2004-04-20');
    return collection
      .getFilteredByTags('notes', 'writing-2', 'class-handout')
      .filter(item => new Date(item.date) <= endDate);
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
