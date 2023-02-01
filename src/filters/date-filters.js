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

  // For the class blogs
  schedulePubDateFilter(value) {
    let dateObject = new Date(value);
    dateObject.setDate(dateObject.getDate() - 3);

    return dateObject.toISOString().split('T')[0];
  },

  w3cDateFilter(value) {
    const dateObject = new Date(value);

    return dateObject.toISOString().split('T')[0];
  },

  w3cDateTimeFilter(value) {
    const dateObject = new Date(value);

    return dateObject.toISOString();
  }
};
