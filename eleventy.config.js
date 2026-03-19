import { IdAttributePlugin, InputPathToUrlTransformPlugin, HtmlBasePlugin, RenderPlugin } from '@11ty/eleventy';
import { feedPlugin } from '@11ty/eleventy-plugin-rss';
import pluginSyntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';
import pluginNavigation from '@11ty/eleventy-navigation';
import { eleventyImageTransformPlugin } from '@11ty/eleventy-img';
import mdItDefList from 'markdown-it-deflist';
import mdItFootnote from 'markdown-it-footnote';

import pluginFilters from './src/_config/filters.js';
import pluginShortcodes from './src/_config/shortCodes.js';

/**
 * A lot of configuration has been taken from https://github.com/11ty/eleventy-base-blog
 * @param {import('@11ty/eleventy/UserConfig').default} eleventyConfig 
 */
export default async function (eleventyConfig) {
  // Drafts, see also _data/eleventyDataSchema.js
	eleventyConfig.addPreprocessor('drafts', '*', (data, content) => {
		if (data.draft) {
			data.title = `${data.title} (draft)`;
		}

		if(data.draft && process.env.ELEVENTY_RUN_MODE === 'build') {
			return false;
		}
	});

  eleventyConfig.amendLibrary('md', (mdLib) => {
    mdLib.set({ typographer: true });
    mdLib.use(mdItDefList);
    mdLib.use(mdItFootnote);

    mdLib.renderer.rules.footnote_caption = (tokens, idx) => {
      let n = Number(tokens[idx].meta.id + 1).toString();
      if (tokens[idx].meta.subId > 0) {
        n += ':' + tokens[idx].meta.subId;
      }

      return `<span class="visually-hidden">footnote </span><sup class="footnote__ref">${n}</sup>`;
    };

    mdLib.renderer.rules.footnote_ref = (tokens, idx, options, env, slf) => {
      const id = slf.rules.footnote_anchor_name(tokens, idx, options, env);
      const caption = slf.rules.footnote_caption(tokens, idx);
      
      let refid = id;
      if (tokens[idx].meta.subId > 0) {
        refid += ':' + tokens[idx].meta.subId;
      }

      return `<a href="#fn${id}" id="fnref${refid}">${caption}</a>`;
    };

    mdLib.renderer.rules.footnote_block_open = () => '<footer class="footnotes flow">\n<h2>Footnotes</h2>\n<ol class="flow">\n';
    
    mdLib.renderer.rules.footnote_block_close = () => '</ol>\n</footer>\n';

    mdLib.renderer.rules.footnote_open = (tokens, idx, options, env, slf) => {
      let id = slf.rules.footnote_anchor_name(tokens, idx, options, env);
      if (tokens[idx].meta.subId > 0) {
        id += ':' + tokens[idx].meta.subId;
      }

      return `<li id="fn${id}">`;
    };

    mdLib.renderer.rules.footnote_anchor = (tokens, idx, options, env, slf) => {
      let id = slf.rules.footnote_anchor_name(tokens, idx, options, env);
      if (tokens[idx].meta.subId > 0) {
        id += ':' + tokens[idx].meta.subId;
      }

      return ` <a href="#fnref${id}" class="footnote__backref"><span class="visually-hidden">back to link to footnote ${id}</span><small aria-hidden="true">↩</small></a>`;
    };
  });

  eleventyConfig.addPassthroughCopy({
    './public': '/',
  });
  eleventyConfig.addPassthroughCopy('./src/content/**/*.jpeg');
  eleventyConfig.addPassthroughCopy('./src/content/**/*.png');

  // Watch CSS files
  eleventyConfig.addWatchTarget('./src/_includes/css/**/*.css');
  // Watch images for the image pipeline.
	eleventyConfig.addWatchTarget('./src/content/**/*.{svg,webp,png,jpg,jpeg,gif}');

  eleventyConfig.addBundle('css', {
    toFileDirectory: 'css',
    bundleHtmlContentFromSelector: 'style',
  });

  eleventyConfig.addBundle('js', {
    toFileDirectory: 'js',
    bundleHtmlContentFromSelector: 'script',
  });

  eleventyConfig.addPlugin(pluginSyntaxHighlight, {
    preAttributes: { tabindex: 0 },
  });
  eleventyConfig.addPlugin(pluginNavigation);
  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);
  eleventyConfig.addPlugin(RenderPlugin);

  const feedData = {
    collection: {
      name: 'notes',
      limit: 10,
    },
    metadata: {
      language: 'en-US',
      title: 'Erik Vorhes',
      subtitle: 'Ideas and things from my personal site.',
      base: 'https://erikvorhes.com/',
      author: {
        name: 'Erik Vorhes'
      },
    },
  };
  eleventyConfig.addPlugin(feedPlugin, {
    type: 'atom',
    outputPath: '/feed.atom.xml',
    templateData: {
      eleventyNavigation: {
        key: 'Feed (Atom)',
        order: 6,
      },
    },
    ...feedData,
  });
  eleventyConfig.addPlugin(feedPlugin, {
    type: 'json',
    outputPath: '/feed.json',
    templateData: {
      eleventyNavigation: {
        key: 'Feed (JSON)',
        order: 7,
      },
    },
    ...feedData,
  });
  eleventyConfig.addPlugin(feedPlugin, {
    type: 'rss',
    outputPath: '/feed.rss.xml',
    templateData: {
      eleventyNavigation: {
        key: 'Feed (RSS)',
        order: 8,
      },
    },
    ...feedData,
  });

  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ['avif', 'webp', 'auto'],
    failOnError: false,
    htmlOptions: {
      imgAttributes: {
        loading: 'lazy',
        decoding: 'async',
        'data-pagefind-index-attrs': 'alt',
      },
    },
    sharpOptions: {
      animated: true,
    },
  });

  eleventyConfig.addPlugin(pluginFilters);

  eleventyConfig.addPlugin(pluginShortcodes);

  eleventyConfig.addPlugin(IdAttributePlugin);

  const courses = [
    {
      camel: 'natureLiterature',
      courseSnake: 'luc_288_081',
      tag: 'nature and literature',
      end: '2007-12-15',
    },
    {
      camel: 'shakespeare',
      courseSnake: 'luc_274_086',
      tag: 'shakespeare',
      end: '2006-05-18',
    },
    {
      camel: 'writing1',
      courseSnake: 'luc_105_053',
      tag: 'writing 1',
      end: '2003-12-11',
    },
    {
      camel: 'writing2',
      courseSnake: 'luc_106_053',
      tag: 'writing 2',
      end: '2004-04-20',
    },
    {
      camel: 'writingSeminar',
      courseSnake: 'luc_110_104',
      tag: 'writing seminar',
      end: '2007-12-11',
    },
  ];

  for (const { camel, courseSnake, tag, end } of courses) {
    eleventyConfig.addCollection(`${camel}Schedule`, (collectionApi) => {
      return collectionApi.getFilteredByTags('schedule', courseSnake);
    });
    eleventyConfig.addCollection(`${camel}Handouts`, (collectionApi) => {
      const endDate = new Date(end);
      return collectionApi
        .getFilteredByTags('notes', 'class handout', tag)
        .filter(item => new Date(item.date) <= endDate);
    });
  }

  eleventyConfig.addCollection('teaching', (collectionApi) => {
    return collectionApi.getFilteredByTag('course description');
  });

  eleventyConfig.addShortcode('currentBuildDate', () => (new Date()).toISOString());
}

export const config = {
  hasTemplateFormats: [
    'md',
    'njk',
    '11ty.js',
  ],
  markdownTemplateEngine: 'njk',
  htmlTemplateEngine: 'njk',
  dir: {
    input: 'src/content',
    includes: '../_includes',
    data: '../_data',
    output: 'dist',
  },
};
