/**
 * React 19 ignores Text.defaultProps — RN still defaults allowFontScaling to ON.
 * Patch RN sources so scaling is opt-in only (allowFontScaling === true).
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'node_modules', 'react-native');

const textReplacements = [
  [
    'allowFontScaling: allowFontScaling !== false',
    'allowFontScaling: allowFontScaling === true',
  ],
  [
    'allowFontScaling={allowFontScaling !== false}',
    'allowFontScaling={allowFontScaling === true}',
  ],
];

const patches = [
  {
    file: path.join(root, 'Libraries', 'Text', 'Text.js'),
    replacements: textReplacements,
  },
  {
    file: path.join(root, 'Libraries', 'Components', 'TextInput', 'TextInput.js'),
    replacements: [['allowFontScaling = true,', 'allowFontScaling = false,']],
  },
];

let changed = 0;

for (const {file, replacements} of patches) {
  if (!fs.existsSync(file)) {
    console.warn('[patch-font-scaling] skip missing:', file);
    continue;
  }
  let content = fs.readFileSync(file, 'utf8');
  let fileChanged = false;
  for (const [from, to] of replacements) {
    if (!content.includes(from)) {
      if (content.includes(to)) {
        continue;
      }
      console.warn('[patch-font-scaling] pattern not found in:', file, from);
      continue;
    }
    content = content.split(from).join(to);
    fileChanged = true;
  }
  if (fileChanged) {
    fs.writeFileSync(file, content, 'utf8');
    changed += 1;
    console.log('[patch-font-scaling] patched:', path.basename(file));
  } else {
    console.log('[patch-font-scaling] already patched:', path.basename(file));
  }
}

if (!changed) {
  console.log('[patch-font-scaling] no files changed');
}
