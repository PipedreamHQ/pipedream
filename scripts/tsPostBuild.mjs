import path from 'path'
import readline from 'readline';
import { fix } from 'tsc-esm-fix';

(async () => {
  // Input comes from stdin, where each line is a file emitted by tsc
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  const files = []
  const outDirs = []

  await new Promise((resolve, reject) => {
    rl.on('line', async (line) => {
      const filename = line.replace(/^TSFILE: /g, '');  
      if (!filename.endsWith("js")) {
        return
      }

      // tsc-esm-fix modifies `.js` imports to `.mjs`. tsc emits
      // `.js` files, but we need `.mjs` because Pipedream requires
      // `.mjs` when you publish ESM components.
      // See https://www.npmjs.com/package/tsc-esm-fix and 
      // https://github.com/microsoft/TypeScript/issues/16577#issuecomment-309169829
      // for more information on the problem.

      // tsc-esm-fix takes directories as input, but it needs to be the root
      // outDir of the component. This is defined in the tsconfig for a given
      // package, but tsc-esm-fix doesn't appear to respect references in the
      // root tsconfig. Alternatively, a custom glob pattern for the compiled
      // output files can be specified. For example:
      // `components/rss/dist/**/*.{js,mjs,d.ts}`
      const dir = path.dirname(filename);
      // XXX we should really read the tsconfig for the given package and get the outDir from there
      const match = dir.match(/(.*dist\/).*/);
      if (!match) {
        console.log('dist match not found for:', dir);
      }
      const outDir = match?.[1];
      if (outDir && !outDirs.includes(outDir)) {
        outDirs.push(outDir);
      } 
      files.push(filename);
    })

    rl.on('close', () => {
      resolve();
    })
  })

  for (const outDir of outDirs) {
    await fix({
      ext: '.mjs',
      // tsc-esm-fix includes only `.js` and `.d.ts` files in outDir when making
      // fixes, by default: `${outDir}/**/*.{js,d.ts}`. Include `.mjs` files in
      // `target` to allow tsc-esm-fix to modify imports of those files to
      // `.mjs`.
      target: `${outDir}/**/*.{js,mjs,d.ts}`,
    })
  }

  // At this point, tsc-esm-fix has already modified the file to `.mjs`,
  // so we need to emit the `.mjs` filename for the next stage of the pipe
  for (const file of files) {
    console.log(file.replace(/\.js$/, '.mjs'));
  }
})();