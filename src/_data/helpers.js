module.exports = {
  getLinkActiveState(itemUrl, pageUrl) {
    return itemUrl === pageUrl ? ' aria-current="page"' : '';
  },

  getNextHeadingLevel(currentLevel) {
    return parseInt(currentLevel, 10) + 1;
  },

  getReadingTime(text) {
    const wpm = 200;
    const wordCount = text.split(/\s+/g).length;

    return Math.ceil(wordCount / wpm);
  }
}
