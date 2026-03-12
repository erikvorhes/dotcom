export default {
  layout: 'layouts/schedule_day.njk',
  course: 'Nature in Literature',
  eleventyComputed: {
    title: "{{ date | readableDateWithWeekday }}",
  },
}
