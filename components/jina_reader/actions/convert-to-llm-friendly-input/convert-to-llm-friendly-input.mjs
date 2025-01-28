import fs from "fs";
import path from "path";
import { ConfigurationError } from "@pipedream/platform";
import app from "../../jina_reader.app.mjs";

export default {
  key: "jina_reader-convert-to-llm-friendly-input",
  name: "Convert URL To LLM-Friendly Input",
  description: "Converts a provided URL to an LLM-friendly input using Jina Reader. [See the documentation](https://github.com/jina-ai/reader)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    url: {
      type: "string",
      label: "URL",
      description: "The URL to convert to an LLM-friendly input.",
      optional: true,
    },
    contentFormat: {
      type: "string",
      label: "Content Format",
      description: "You can control the level of detail in the response to prevent over-filtering. The default pipeline is optimized for most websites and LLM input.",
      optional: true,
      options: [
        "markdown",
        "html",
        "text",
        "screenshot",
        "pageshot",
      ],
    },
    timeout: {
      type: "integer",
      label: "Timeout",
      description: "Maximum time to wait for the webpage to load. Note that this is NOT the total time for the whole end-to-end request.",
      optional: true,
    },
    targetSelector: {
      type: "string",
      label: "Target Selector",
      description: "Provide a list of CSS selector to focus on more specific parts of the page. Useful when your desired content doesn't show under the default settings. E.g., `body, .class, #id`.",
      optional: true,
    },
    waitForSelector: {
      type: "string",
      label: "Wait For Selector",
      description: "Provide a list of CSS selector to wait for specific elements to appear before returning. Useful when your desired content doesn't show under the default settings. E.g., `body, .class, #id`.",
      optional: true,
    },
    excludedSelector: {
      type: "string",
      label: "Excluded Selector",
      description: "Provide a list of CSS selector to remove the specified elements of the page. Useful when you want to exclude specific parts of the page like headers, footers, etc. E.g., `header, .class, #id`.",
      optional: true,
    },
    jsonResponse: {
      type: "boolean",
      label: "JSON Response",
      description: "The response will be in JSON format, containing the URL, title, content, and timestamp (if available). In Search mode, it returns a list of five entries, each following the described JSON structure. Keep in mind **JSON Response** will take piority over **Stream mode** if both are enabled.",
      optional: true,
    },
    forwardCookie: {
      type: "string",
      label: "Forward Cookie",
      description: "The API server can forward your custom cookie settings when accessing the URL, which is useful for pages requiring extra authentication. Note that requests with cookies will not be cached. E.g., `<cookie-name>=<cookie-value>, <cookie-name-1>=<cookie-value>; domain=<cookie-1-domain>`. [Learn more here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie).",
      optional: true,
    },
    useProxyServer: {
      type: "string",
      label: "Proxy Server URL",
      description: "The API server can utilize your proxy to access URLs, which is helpful for pages accessible only through specific proxies. E.g., `http://your_proxy_server.com`. [Learn more here](https://en.wikipedia.org/wiki/Proxy_server).",
      optional: true,
    },
    bypassCache: {
      type: "boolean",
      label: "Bypass Cache",
      description: "The API server caches both Read and Search mode contents for a certain amount of time. To bypass this cache, set this header to `true`.",
      optional: true,
    },
    streamMode: {
      type: "boolean",
      label: "Stream Mode",
      description: "Stream mode is beneficial for large target pages, allowing more time for the page to fully render. If standard mode results in incomplete content, consider using **Stream mode**. [Learn more here](https://github.com/jina-ai/reader?tab=readme-ov-file#streaming-mode). Keep in mind **JSON Response** will take piority over **Stream mode** if both are enabled.",
      optional: true,
    },
    browserLocale: {
      type: "string",
      label: "Browser Locale",
      description: "Control the browser locale to render the page. eg. `en-US`. [Learn more here](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/language).",
      optional: true,
    },
    iframeContent: {
      type: "boolean",
      label: "Iframe",
      description: "Returning result will also include the content of the iframes on the page.",
      optional: true,
    },
    shadowDomContent: {
      type: "boolean",
      label: "Include Shadow DOM Content",
      description: "Returning result will also include the content of the shadow DOM on the page.",
      optional: true,
    },
    pdf: {
      type: "string",
      label: "PDF File Path",
      description: "The path to the pdf file saved to the `/tmp` directory (e.g. `/tmp/example.pdf`). [See the documentation](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory).",
      optional: true,
    },
    html: {
      type: "string",
      label: "HTML File Path",
      description: "The path to the html file saved to the `/tmp` directory (e.g. `/tmp/example.html`). [See the documentation](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory).",
      optional: true,
    },
  },
  methods: {
    async readFileFromTmp(filePath, encoding) {
      if (!filePath) {
        return;
      }
      const resolvedPath = path.resolve(filePath);
      if (!resolvedPath.startsWith("/tmp/")) {
        throw new ConfigurationError(`${filePath} must be located in the '/tmp/' directory`);
      }
      return await fs.promises.readFile(resolvedPath, encoding);
    },
  },
  async run({ $ }) {
    const {
      app,
      readFileFromTmp,
      url,
      contentFormat,
      timeout,
      targetSelector,
      waitForSelector,
      excludedSelector,
      jsonResponse,
      forwardCookie,
      useProxyServer,
      bypassCache,
      streamMode,
      browserLocale,
      iframeContent,
      shadowDomContent,
      pdf,
      html,
    } = this;

    if (!url && !pdf && !html) {
      throw new ConfigurationError("You must provide at least one of **URL**, **PDF File Path**, or **HTML File Path**.");
    }

    const response = await app.post({
      $,
      headers: {
        "X-Return-Format": contentFormat,
        "X-Timeout": timeout,
        "X-Target-Selector": targetSelector,
        "X-Wait-For-Selector": waitForSelector,
        "X-Remove-Selector": excludedSelector,
        "X-Set-Cookie": forwardCookie,
        "X-Proxy-Url": useProxyServer,
        "X-No-Cache": bypassCache,
        "Accept": jsonResponse
          ? "application/json"
          : streamMode
            ? "text/event-stream"
            : undefined,
        "X-Locale": browserLocale,
        "X-With-Shadow-Dom": shadowDomContent,
        "X-Iframe": iframeContent,
      },
      data: {
        url,
        pdf: await readFileFromTmp(pdf, "base64"),
        html: await readFileFromTmp(html, "utf-8"),
      },
    });

    $.export("$summary", "Converted URL to LLM-friendly input successfully.");
    return response;
  },
};
