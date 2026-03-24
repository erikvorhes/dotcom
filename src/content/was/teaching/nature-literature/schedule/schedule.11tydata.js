export default {
  layout: 'layouts/schedule_day.njk',
  course: 'Nature in Literature',
  tags: ['schedule', 'luc_288_081'],
  eleventyComputed: {
    title: "{{ date | readableDateWithWeekday }}",
  },
}
