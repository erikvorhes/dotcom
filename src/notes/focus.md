---
title: Focus!
date: 2023-02-25
summary: A bit of JavaScript to ensure your page’s IDs can be focused, even when you forget to do the work in the HTML.
tags:
  - accessibility
  - html
  - javascript
  - tutorial
---

One of the cool things about [the hash at the end of a URL](https://www.w3.org/Addressing/URL/4_2_Fragments.html) is that it can target an ID on the current page and auto-scroll the window to that point on the page. You can even use CSS to style it with [the `:target` pseudo-class](https://w3c.github.io/csswg-drafts/selectors/#the-target-pseudo). This is a nice thing, especially on long or complicated pages.

But it's not perfect. If the target of the hash can't receive focus[^1] and you hit <kbd>Tab</kbd>, you won't go to the next focusable element on the page after the thing you scrolled to.[^2] Instead, you'll go to the *first* thing on the page that can receive focus. This can be pretty disorienting!

There are ways to fix the problem, though! The first is by tweaking your HTML to add a [`tabindex`](https://html.spec.whatwg.org/multipage/interaction.html#attr-tabindex):

``` html
<h2 id="footnotes" tabindex="-1">Footnotes</h2>
```

Here I've added `tabindex="-1"` to the `h2` element so that the heading *programmatically* focusable.[^3] The browser will focus the heading if the URL hash is `#footnotes`. Now when you hit <kbd>Tab</kbd>, you'll focus on the next focusable element after the heading, and all is right with the world.

We can enhance this approach by introducing a little JavaScript. There are plenty of instances where you might forget to include that handy `tabindex="-1"` *or* you're afraid you'll override an already-focusable element's `tabindex` value. And if you're working with a CMS or writing in a format that gets converted to HTML later, you might not have a straightforward way to do that work. To handle those scenarios, you can use something like this:[^4]

``` js
/**
 * Focuses an element even if it isn't focusable.
 * @param {HTMLElement} target - element to focus
 */
function focusTarget(target) {
  // If the element already has focus
  // we don't need to do anything
  if (document.activeElement === target) {
    return;
  }

  // By default an element will have a `tabIndex` of -1
  // but if it isn't explicitly set, it can't be focused
  if (target.tabIndex < 0 && !target.getAttribute('tabIndex')) {
    target.setAttribute('tabIndex', '-1');
  }

  target.focus();
}

function focusHash() {
  const hash = window.location.hash;
  const target = hash ? document.querySelector(hash) : null;

  if (target) {
    focusTarget(target);
  }
}

// If there's already a hash, let's focus it.
window.addEventListener('DOMContentLoaded', focusHash);
// If the hash changes, let's focus the new one.
window.addEventListener('hashchange', focusHash);
```

Several years ago I remember seeing something like this, but when I needed it again, I couldn't find it. I hope I don't lose it again this time!

[^1]: Which is the case for most HTML elements aside from `a` and form controls, sigh.

[^2]: And in some browsers, if focus can't be set, it won't even scroll you to the right point on the page.

[^3]: You could even use `tabindex="0"` if you want to ensure that the element is always focusable by keyboard.

[^4]: I've also made this available as a [GitHub Gist](https://gist.github.com/erikvorhes/2ceb77788b9db10c89fd7200440f2de8).
