export default {
  layout: 'layouts/schedule_day.njk',
  course: 'Writing I',
  tags: ['schedule', 'luc_105_053'],
  eleventyComputed: {
    title: "{{ date | readableDateWithWeekday }}",
  },
}
