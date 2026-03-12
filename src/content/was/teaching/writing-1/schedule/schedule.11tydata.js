export default {
  layout: 'layouts/schedule_day.njk',
  course: 'Writing I',
  eleventyComputed: {
    title: "{{ date | readableDateWithWeekday }}",
  },
}
