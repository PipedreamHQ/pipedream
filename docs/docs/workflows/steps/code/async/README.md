# Running asynchronous code

If you're not familiar with asynchronous programming concepts like [callback functions](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function) or [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises), see [this overview](https://eloquentjavascript.net/11_async.html).

[[toc]]

## The problem

**Any asynchronous code within a Node.js code step must complete before the next step runs**. This ensures future steps have access to its data. If Pipedream detects that code is still running by the time the step completes, you'll see the following warning below the code step:

> **This step was still trying to run code when the step ended. Make sure you await all Promises, or promisify callback functions.** 

As the warning notes, this often arises from one of two issues:

- You forgot to `await` a Promise. [All Promises must be awaited](#await-all-promises) within a step so they resolve before the step finishes.
- You tried to run a callback function. Since callback functions run asynchronously, they typically will not finish before the step ends. [You can wrap your function in a Promise](#wrap-callback-functions-in-a-promise) to make sure it resolves before the step finishes.

## Solutions

### `await` all Promises

Most Node.js packages that run async code return Promises as the result of method calls. For example, [`axios`](https://docs.pipedream.com/workflows/steps/code/nodejs/http-requests/#basic-axios-usage-notes) is an HTTP client. If you make an HTTP request like this in a Pipedream code step:

```javascript
const resp = axios({
  method: "GET",
  url: `https://swapi.co/api/films/`,
});
```

It won't send the HTTP request, since **`axios` returns a Promise**. Instead, add an `await` in front of the call to `axios`:

```javascript
const resp = await axios({
  method: "GET",
  url: `https://swapi.co/api/films/`,
});
```

In short, always do this:

```javascript
const res = await runAsyncCode();
```

instead of this:

```javascript
// This code may not finish by the time the workflow finishes
runAsyncCode();
```

### Wrap callback functions in a Promise

Before support for Promises was widespread, [callback functions](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function) were a popular way to run some code asynchronously, after some operation was completed. For example, [PDFKit](https://pdfkit.org/) lets you pass a callback function that runs when certain events fire, like when the PDF has been finalized:

```javascript
const PDFDocument = require("pdfkit");
const fs = require("fs");

let doc = new PDFDocument({ size: "A4", margin: 50 });
this.fileName = `tmp/test.pdf`;
let file = fs.createWriteStream(this.fileName);
doc.pipe(file);
doc.text("Hello world!");

// Finalize PDF file
doc.end();
file.on("finish", () => {
  console.log(fs.statSync(this.fileName));
});
```

This is the callback function:

```javascript
() => {
  console.log(fs.statSync(this.fileName));
};
```

and **it will not run**. By running a callback function in this way, we're saying that we want the function to be run asynchronously. But on Pipedream, this code must finish by the time the step ends. **You can wrap this callback function in a Promise to make sure that happens**. Instead of running:

```javascript
file.on("finish", () => {
  console.log(fs.statSync(this.fileName));
});
```

run:

```javascript
// Wait for PDF to finalize
await new Promise((resolve) => file.on("finish", resolve));
// Once done, get stats
const stats = fs.statSync(this.filePath);
```

This is called "[promisification](https://javascript.info/promisify)".

You can often promisify a function in one line using Node.js' [`util.promisify` function](https://2ality.com/2017/05/util-promisify.html).

### Other solutions

If a specific library doesn't support Promises, you can often find an equivalent library that does. For example, many older HTTP clients like `request` didn't support Promises natively, but the community [published packages that wrapped it with a Promise-based interface](https://www.npmjs.com/package/request#promises--asyncawait) (note: `request` has been deprecated, this is just an example).

## False positives

This warning can also be a false positive. If you're successfully awaiting all Promises, Pipedream could be throwing the warning in error. If you observe this, please [file a bug](https://github.com/PipedreamHQ/pipedream/issues/new?assignees=&labels=bug&template=bug_report.md&title=%5BBUG%5D+).

Packages that make HTTP requests or read data from disk (for example) fail to resolve Promises at the right time, or at all. This means that Pipedream is correctly detecting that code is still running, but there's also no issue - the library successfully ran, but just failed to resolve the Promise. You can safely ignore the error if all relevant operations are truly succeeding.
