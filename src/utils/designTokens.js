const fs = require('fs');
const path = require('path');
const tokens = require('../_data/design-tokens.json');

const ANSIColors = {
  green(text) {
    return `\u001b[32m${text}\u001b[0m`;
  }
};
const ROOT_SIZE = 16;
const MAX_VIEWPORT = tokens.viewport.max / ROOT_SIZE;
const MIN_VIEWPORT = tokens.viewport.min / ROOT_SIZE;

function clampGenerator([min, max]) {
  const minSize = min / ROOT_SIZE;

  if (min === max) {
    return `${minSize}rem`;
  }

  const maxSize = max / ROOT_SIZE;

  const slope = (maxSize - minSize) / (MAX_VIEWPORT - MIN_VIEWPORT);
  const intersection = -1 * MIN_VIEWPORT * slope + minSize;

  return `clamp(${minSize}rem, calc(${
    intersection.toFixed(2)
  }rem + ${
    (slope * 100).toFixed(2)
  }vi), ${maxSize}rem)`;
}

function getColors() {
  const colors = [];
  Object.entries(tokens.color).forEach(
    function processColors([key, color]) {
      colors.push(`--color-${key}: ${color};`);
    }
  )

  return colors.join('\n  ');
}

function getSizes(tokenKey, prefix) {
  const sizes = [];
  Object.entries(tokens[tokenKey]).forEach(
    function processSizeEntries([key, val]) {
      sizes.push(`--${prefix}-${key}: ${clampGenerator(val)};`);
    }
  );

  return sizes.join('\n  ');
}

const css = `
  --font-family-emoji: ${tokens.fontFamily.emoji};
  --font-family-mono: ${tokens.fontFamily.mono};
  --font-family-sans: ${tokens.fontFamily.sans};
  --font-family-serif: ${tokens.fontFamily.serif};
  --measure: ${tokens.measure};
  ${getColors()}
  ${getSizes('textSize', 'size-step')}
  ${getSizes('spacing', 'space')}
`;

fs.writeFile(path.join(process.cwd(), 'src/css/config.css'), `:root {${css}}\n`, function(err) {
  if (err) {
    console.error('Could not write the config CSS file');
    throw err
  }

  console.log(ANSIColors.green('OK - config CSS file written successfully.\n'))
})
