import arxiv from "../../arxiv.app.mjs";
import fs from "fs";

export default {
  key: "arxiv-search-articles",
  name: "Search Articles",
  description: "Search for articles on arXiv. [See the documentation](https://info.arxiv.org/help/api/user-manual.html#2-api-quickstart)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    arxiv,
    searchQuery: {
      type: "string",
      label: "Search Query",
      description: "The search query to use. Example: `all:electron`. [See the documentation](https://info.arxiv.org/help/api/user-manual.html#51-details-of-query-construction) for information on constructing a search query.",
      optional: true,
    },
    idList: {
      type: "string[]",
      label: "ID List",
      description: "A list of arXiv article IDs to search for. Example ID: `2505.08081v1`",
      optional: true,
    },
    start: {
      type: "integer",
      label: "Start",
      description: "The index of the first result to return. Defaults to 0.",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return. Defaults to 10.",
      optional: true,
    },
    filename: {
      type: "string",
      label: "Filename",
      description: "A filename to save the result as an xml file to the /tmp directory. Example: `arxiv-search-results.xml`",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    const response = await this.arxiv.search({
      $,
      params: {
        search_query: this.searchQuery,
        id_list: this.idList
          ? this.idList.join(",")
          : undefined,
        start: this.start,
        max_results: this.maxResults,
      },
    });

    if (!this.filename) {
      $.export("$summary", "Successfully searched for articles");
      return response;
    }

    const filePath = `/tmp/${this.filename}`;
    fs.writeFileSync(filePath, response, "utf8");

    $.export("$summary", `Successfully saved search results to ${filePath}`);
    return {
      filePath,
      fileContent: response,
    };
  },
};
