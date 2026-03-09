export default {
  layout: 'layouts/schedule.njk',
  course: 'Writing II',
  eleventyComputed: {
    title: "{{ date | readableDateWithWeekday }}",
  },
}