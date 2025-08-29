import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-list-templates",
  name: "List Templates",
  description: "Retrieves a list of templates. [See the documentation](https://developers.hubspot.com/docs/reference/api/cms/templates)",
  version: "0.0.3",
  type: "action",
  props: {
    hubspot,
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      default: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const results = [];
    const params = {
      limit: 100,
      offset: 0,
    };
    let hasMore, count = 0;

    do {
      const {
        total_count: total, objects,
      } = await this.hubspot.listTemplates({
        $,
        params,
      });
      if (!objects?.length) {
        break;
      }
      for (const item of objects) {
        results.push(item);
        count++;
        if (count >= this.maxResults) {
          break;
        }
      }
      hasMore = count < total;
      params.offset += params.limit;
    } while (hasMore && count < this.maxResults);

    $.export("$summary", `Found ${results.length} template${results.length === 1
      ? ""
      : "s"}`);
    return results;
  },
};
