export default {
  layout: 'layouts/schedule_day.njk',
  course: 'Writing II',
  tags: ['schedule', 'luc_106_053'],
  eleventyComputed: {
    title: "{{ date | readableDateWithWeekday }}",
  },
}