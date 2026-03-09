import { DateTime } from 'luxon';

/**
 * A lot of the filters have been taken from https://github.com/11ty/eleventy-base-blog
 * @param {import('@11ty/eleventy/UserConfig').default} eleventyConfig 
 */
export default function(eleventyConfig) {
	eleventyConfig.addFilter('readableDate', (dateObj, zone) => {
		// Formatting tokens for Luxon: https://moment.github.io/luxon/#/formatting
		return DateTime.fromJSDate(dateObj, { zone: zone || 'utc' }).toLocaleString(DateTime.DATE_FULL);
	});

	eleventyConfig.addFilter('readableDateWithWeekday', (dateObj, zone) => {
		return DateTime.fromJSDate(dateObj, { zone: zone || 'utc' }).toLocaleString(DateTime.DATE_HUGE);
	})

	eleventyConfig.addFilter('htmlDateString', (dateObj) => {
		return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toISODate();
	});

	// Get the first `n` elements of a collection.
	eleventyConfig.addFilter('head', (array, n) => {
		if(!Array.isArray(array) || array.length === 0) {
			return [];
		}
		if( n < 0 ) {
			return array.slice(n);
		}

		return array.slice(0, n);
	});

	// Return the smallest number argument
	eleventyConfig.addFilter('min', (...numbers) => {
		return Math.min.apply(null, numbers);
	});

	// Return the keys used in an object
	eleventyConfig.addFilter('getKeys', target => {
		return Object.keys(target);
	});

	eleventyConfig.addFilter('filterTagList', function filterTagList(tags) {
		return (tags || []).filter(tag => ['all', 'notes'].indexOf(tag) === -1);
	});

	eleventyConfig.addFilter('sortAlphabetically', strings =>
		(strings || []).sort((b, a) => b.localeCompare(a))
	);

	eleventyConfig.addFilter('stripDotSlash', string => 
		string.replace(/^\.\/(.*)$/, '$1')
	);

	// strip paragraph tags use after renderContent('md'), e.g., {{ data | renderContent('md') | stripOuterParagraph }}
	// risky because it doesn't account for multiple paragraphs
	eleventyConfig.addFilter('stripOuterParagraph', content => {
		const wrapper = document.createElement('div');
		wrapper.innerHTML = content;
		const p = wrapper.querySelector('p');
		
		return p ? p.innerHTML : content;
	});
};