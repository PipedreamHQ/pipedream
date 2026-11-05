import app from "../../bunnycdn.app.mjs";

export default {
  key: "bunnycdn-purge-url",
  name: "Purge URL",
  description: "Clear one URL from the cache, so the next request fetches it from the origin."
    + " Use **Purge Pull Zone Cache** to clear a whole pull zone instead."
    + " [See the documentation](https://bunny.net/docs/api-reference/core/purge/purge-url)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    openWorldHint: true,
  },
  props: {
    app,
    url: {
      type: "string",
      label: "URL",
      description: "The full URL to clear, e.g. `https://example.b-cdn.net/images/logo.png`.",
    },
    runAsync: {
      type: "boolean",
      label: "Run Async",
      description: "Return without waiting for the purge to finish, e.g. `true`. Defaults to `false`.",
      optional: true,
    },
  },
  async run({ $ }) {
    await this.app.purgeUrl({
      $,
      params: {
        url: this.url,
        async: this.runAsync,
      },
    });
    $.export("$summary", `Purged ${this.url}`);
    return {
      success: true,
    };
  },
};
