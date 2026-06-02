import common from "../common/common.mjs";

export default {
  key: "asana-search-sections",
  name: "Search Sections",
  description: "Searches for a section by name within a particular project. [See the documentation](https://developers.asana.com/docs/get-sections-in-a-project)",
  version: "0.3.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    name: {
      label: "Name",
      description: "The name of the section to search for.",
      type: "string",
    },
    maxResults: {
      propDefinition: [
        common.props.asana,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    let hasMore, count = 0;
    const params = {
      limit: Math.min(this.maxResults, 100),
    };
    const results = [];

    do {
      const {
        data, next_page: next,
      } = await this.asana.getSections({
        project: this.project,
        params,
        $,
      });

      hasMore = next;
      params.offset = next?.offset;

      if (data.length === 0) break;

      for (const section of data) {
        if (this.name && !section.name.includes(this.name)) continue;
        results.push(section);
        if (++count >= this.maxResults) {
          hasMore = false;
          break;
        }
      }
    } while (hasMore);

    $.export("$summary", `Retrieved ${results.length} section${results.length !== 1
      ? "s"
      : ""}`);
    return results;
  },
};
