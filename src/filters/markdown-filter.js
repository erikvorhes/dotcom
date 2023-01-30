const mdIt = require('markdown-it')({
  html: true,
  linkify: true,
  typographer: true,
});

const mdItContainer = require('markdown-it-container');

mdIt.use(require('markdown-it-attrs'));
mdIt.use(mdItContainer, 'verse'); // May add additional custom blocks, could be handy!
mdIt.use(require('markdown-it-deflist'));
mdIt.use(require('markdown-it-footnote'));

// change pre block so no code element is injected:
mdIt.renderer.rules.code_block = (tokens, idx, _, __, slf) => {
  const token = tokens[idx];

  return `<pre${slf.renderAttrs(token)}>${mdIt.utils.escapeHtml(token.content)}</pre>\n`
}

// fix footnote stuff
mdIt.renderer.rules.footnote_caption = (tokens, idx) => {
  let n = Number(tokens[idx].meta.id + 1).toString();

  if (tokens[idx].meta.subId > 0) {
    n += ':' + tokens[idx].meta.subId;
  }

  return `[<span class="visually-hidden">footnote </span>${n}]`;
}
mdIt.renderer.rules.footnote_ref = (tokens, idx, options, env, slf) => {
  const id = slf.rules.footnote_anchor_name(tokens, idx, options, env);
  const caption = slf.rules.footnote_caption(tokens, idx);
  let refid = id;

  if (tokens[idx].meta.subId > 0) {
    refid += ':' + tokens[idx].meta.subId;
  }

  return `<sup class="footnote__ref"><a href="#fn${id}" id="fnref${refid}">${caption}</a></sup>`
};
mdIt.renderer.rules.footnote_block_open = () => '<footer class="footnotes">\n<h2>Footnotes</h2>\n<ol>\n';
mdIt.renderer.rules.footnote_block_close = () => '</ol>\n</footer>\n';
mdIt.renderer.rules.footnote_open = (tokens, idx, options, env, slf) => {
  let id = slf.rules.footnote_anchor_name(tokens, idx, options, env);

  if (tokens[idx].meta.subId > 0) {
    id += ':' + tokens[idx].meta.subId;
  }

  return `<li id="fn${id}">`;
};
mdIt.renderer.rules.footnote_anchor = (tokens, idx, options, env, slf) => {
  let id = slf.rules.footnote_anchor_name(tokens, idx, options, env);

  if (tokens[idx].meta.subId > 0) {
    id += ':' + tokens[idx].meta.subId;
  }

  /* ↩ with escape code to prevent display as Apple Emoji on iOS */
  return ` <a href="#fnref${id}" class="footnote__backref"><span class="visually-hidden">back to link to footnote ${id}</span><span aria-hidden="true">\u21a9\uFE0E</span></a>`;
}

module.exports = function markdown(value) {
  return mdIt.render(value);
}
