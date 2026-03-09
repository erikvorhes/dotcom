export default {
  layout: 'layouts/schedule.njk',
  course: 'Core Writing Seminar',
  eleventyComputed: {
    title: "{{ date | readableDateWithWeekday }}",
  },
}
