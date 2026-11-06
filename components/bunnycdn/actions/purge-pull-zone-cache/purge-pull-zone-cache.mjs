import app from "../../bunnycdn.app.mjs";

export default {
  key: "bunnycdn-purge-pull-zone-cache",
  name: "Purge Pull Zone Cache",
  description: "Clear the cached files of a pull zone, so the next requests fetch fresh content from the origin."
    + " Use **Purge URL** to clear a single file instead. Origin traffic rises until the cache fills again."
    + " [See the documentation](https://bunny.net/docs/api-reference/core/pull-zone/purge-cache)",
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
    pullZoneId: {
      propDefinition: [
        app,
        "pullZoneId",
      ],
    },
    cacheTag: {
      type: "string",
      label: "Cache Tag",
      description: "Only clear files with this cache tag, e.g. `product-images`. Leave it empty to clear the whole pull zone.",
      optional: true,
    },
  },
  async run({ $ }) {
    await this.app.purgePullZoneCache({
      $,
      pullZoneId: this.pullZoneId,
      data: {
        CacheTag: this.cacheTag,
      },
    });
    $.export("$summary", `Purged the cache of pull zone ${this.pullZoneId}`);
    return {
      success: true,
    };
  },
};
