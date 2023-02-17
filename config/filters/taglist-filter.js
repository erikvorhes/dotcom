/**
 * @param {Array} tags=[]
 */
module.exports = function tagListFilter(tags = []) {
  return tags.filter(tag => ['all', 'note', 'notes'].indexOf(tag) === -1);
}
