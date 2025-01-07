// XXX change this pattern, use vite -- this is to handle the following:
// decode-named-character-reference/index.dom.js
// 5:const element = document.createElement('i')
if (typeof document === "undefined") {
  globalThis.document = {
    createElement: () => { /* noop */ },
  } as any; // eslint-disable-line @typescript-eslint/no-explicit-any
}
