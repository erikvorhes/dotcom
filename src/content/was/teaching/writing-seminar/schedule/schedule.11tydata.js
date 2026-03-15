export default {
  layout: 'layouts/schedule_day.njk',
  course: 'Core Writing Seminar',
  tags: ['schedule', 'luc_110_104'],
  eleventyComputed: {
    title: "{{ date | readableDateWithWeekday }}",
  },
}
