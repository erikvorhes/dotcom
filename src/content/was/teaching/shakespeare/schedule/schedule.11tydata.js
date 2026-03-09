export default {
  layout: 'layouts/schedule.njk',
  course: 'Introduction to Shakespeare',
  eleventyComputed: {
    title: "{{ date | readableDateWithWeekday }}",
  },
}
