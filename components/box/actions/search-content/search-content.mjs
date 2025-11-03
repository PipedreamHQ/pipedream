import app from "../../box.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import utils from "../../common/utils.mjs";

export default {
  name: "Search Content",
  description: "Searches for files, folders, web links, and shared files across the users content or across the entire enterprise. [See the documentation](https://developer.box.com/reference/get-search/).",
  key: "box-search-content",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    searchType: {
      propDefinition: [
        app,
        "searchType",
      ],
    },
    query: {
      propDefinition: [
        app,
        "query",
      ],
    },
    mdfilters: {
      propDefinition: [
        app,
        "mdfilters",
      ],
    },
    fields: {
      propDefinition: [
        app,
        "fields",
      ],
    },
  },
  async run({ $ }) {
    const results = [];
    if (!this.query && !this.mdfilters) {
      throw new ConfigurationError("At least one of `Query` and `Metadata Filters` props is needed.");
    }
    const resourcesStream = await utils.getResourcesStream({
      resourceFn: this.app.searchContent,
      resourceFnArgs: {
        $,
        params: {
          query: this.query,
          mdfilters: this.mdfilters,
          type: this.searchType,
          fields: this.fields,
        },
      },
    });
    for await (const resource of resourcesStream) {
      results.push(resource);
    }
    // eslint-disable-next-line multiline-ternary
    $.export("$summary", results.length ? `Successfully fetched ${results.length} search result${results.length === 1 ? "" : "s"}.` : "No search results.");
    return results;
  },
};
