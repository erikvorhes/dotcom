module.exports = {
  dateFilter(value) {
    const dateObject = new Date(value);

    return dateObject.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  fullDateFilter(value) {
    const dateObject = new Date(value);

    return dateObject.object.toLocaleDateString('en-us', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  },

  toIsoDateFilter(value) {
    const dateObject = new Date(value);

    return dateObject.toISOString().split('T')[0];
  },

  toIsoDateTimeFilter(value) {
    const dateObject = new Date(value);

    return dateObject.toISOString();
  }
};
