export default {
  layout: 'layouts/schedule_day.njk',
  course: 'Introduction to Shakespeare',
  tags: ['schedule', 'luc_274_086'],
  eleventyComputed: {
    title: "{{ date | readableDateWithWeekday }}",
  },
}
