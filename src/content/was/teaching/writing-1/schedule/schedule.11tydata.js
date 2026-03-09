export default {
  layout: 'layouts/schedule.njk',
  course: 'Writing I',
  eleventyComputed: {
    title: "{{ date | readableDateWithWeekday }}",
  },
}
