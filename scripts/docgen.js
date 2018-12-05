const { readFileSync, writeFileSync } = require('fs');
const { resolve, basename } = require('path');
const docgen = require('react-docgen');
const glob = require('glob');
const importedProptypesHandler = require('react-docgen-imported-proptype-handler').default;

const FILES = glob.sync('src/components/**/*.{js,jsx}');

const metadata = FILES.reduce((memo, filepath) => {
  /* append display name handler to handlers list */
  const handlers = docgen.defaultHandlers.concat([
    importedProptypesHandler(filepath)
  ]);

  /* read file to get source code */
  const code = readFileSync(filepath, 'utf8');

  /* parse the component code to get metadata */
  try {
    const data = docgen.parse(code, null, handlers);
    memo[basename(filepath)] = data;
  } catch (err) {
    if (err.message !== 'No suitable component definition found.') {
      console.log('ERROR:', filepath, err);
    }
  }

  return memo;
}, {});


writeFileSync(resolve(process.cwd(), 'DOCGEN_OUTPUT.json'), JSON.stringify(metadata, null, 2));
