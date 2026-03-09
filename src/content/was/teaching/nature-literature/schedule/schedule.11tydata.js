export default {
  layout: 'layouts/schedule.njk',
  course: 'Nature in Literature',
  eleventyComputed: {
    title: "{{ date | readableDateWithWeekday }}",
  },
}
