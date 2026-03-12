export default {
  layout: 'layouts/schedule_day.njk',
  course: 'Introduction to Shakespeare',
  eleventyComputed: {
    title: "{{ date | readableDateWithWeekday }}",
  },
}
