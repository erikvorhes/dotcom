export default {
  layout: 'layouts/schedule_day.njk',
  course: 'Core Writing Seminar',
  eleventyComputed: {
    title: "{{ date | readableDateWithWeekday }}",
  },
}
