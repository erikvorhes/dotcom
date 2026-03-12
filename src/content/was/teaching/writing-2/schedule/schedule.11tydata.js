export default {
  layout: 'layouts/schedule_day.njk',
  course: 'Writing II',
  eleventyComputed: {
    title: "{{ date | readableDateWithWeekday }}",
  },
}