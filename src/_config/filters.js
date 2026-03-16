import CleanCSS from 'clean-css';
import { DateTime } from 'luxon';
import { parse } from 'node-html-parser';
import { minify } from 'terser';

/**
 * A lot of the filters have been taken from https://github.com/11ty/eleventy-base-blog
 * @param {import('@11ty/eleventy/UserConfig').default} eleventyConfig 
 */
export default function(eleventyConfig) {
	eleventyConfig.addFilter('readableDate', function readableDate(dateObj, zone) {
		return DateTime.fromJSDate(dateObj, { zone: zone || 'utc' }).toLocaleString(DateTime.DATE_FULL);
	});

	eleventyConfig.addFilter('readableDateWithWeekday', function readableDateWithWeekday(dateObj, zone) {
		return DateTime.fromJSDate(dateObj, { zone: zone || 'utc' }).toLocaleString(DateTime.DATE_HUGE);
	});

	eleventyConfig.addFilter('monthDay', function monthDay(dateObj, zone) {
		return DateTime.fromJSDate(dateObj, { zone: zone || 'utc' }).toLocaleString({ month: 'long', day: 'numeric' });
	});

	eleventyConfig.addFilter('htmlDateString', function htmlDateString(dateObj) {
		return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toISODate();
	});

	// Get the first `n` elements of a collection.
	eleventyConfig.addFilter('head', function head(array, n) {
		if(!Array.isArray(array) || array.length === 0) {
			return [];
		}
		if( n < 0 ) {
			return array.slice(n);
		}

		return array.slice(0, n);
	});

	// Return the smallest number argument
	eleventyConfig.addFilter('min', function min(...numbers) {
		return Math.min.apply(null, numbers);
	});

	// Return the keys used in an object
	eleventyConfig.addFilter('getKeys', function getKeys(target) {
		return Object.keys(target);
	});

	eleventyConfig.addFilter('filterTagList', function filterTagList(tags) {
		return (tags || []).filter(tag => ['all', 'note', 'notes', 'luc_274_086', 'luc_288_081', 'luc_110_104', 'luc_105_053', 'luc_106_053', 'writing1Handouts', 'writing1Schedule', 'writing2Handouts', 'writing2Schedule', 'writingSeminarHandouts', 'writingSeminarSchedule', 'shakespeareHandouts', 'shakespeareSchedule', 'natureLiteratureHandouts', 'natureLiteratureSchedule'].indexOf(tag) === -1);
	});

	eleventyConfig.addFilter('sortAlphabetically', function sortAlphabetically(strings) {
		return (strings || []).sort((b, a) => b.localeCompare(a));
	});

	eleventyConfig.addFilter('stripOuterParagraph', function stripOuterParagraph(content) {
		const doc = parse(content);
		const p = doc.querySelector('p');
		
		return p ? p.innerHTML : content;
	});

	eleventyConfig.addFilter('cssmin', function cssmin(code) {
		try {
			const minified = new CleanCSS({}).minify(code);
			return minified.styles;
		} catch (err) {
			console.error('CleanCSS error: ', err);
			return code;
		}
	});

	eleventyConfig.addFilter('jsmin', async function jsmin(code) {
		try {
			const minified = await minify(code);
			return minified.code;
		} catch (err) {
			console.error('Terser error: ', err);
			return code;
		}
	});
};