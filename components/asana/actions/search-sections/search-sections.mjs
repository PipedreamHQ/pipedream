import common from "../common/common.mjs";

export default {
  key: "asana-search-sections",
  name: "Search Sections",
  description: "Searches for sections by name within an Asana project. Use this to find section GIDs before calling **Add Task to Section** or when filtering tasks by section. The `name` filter is a client-side substring match. Returns section records with `gid` and `name`. Example: call with `project: '1204567890123456'`, `sectionName: 'In Progress'` → returns `[{gid: '1203456789012345', name: 'In Progress'}]`. [See the documentation](https://developers.asana.com/docs/get-sections-in-a-project)",
  version: "0.3.3",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    sectionName: {
      label: "Name",
      description: "The name of the section to search for (client-side substring match). Omit to return all sections in the project.",
      type: "string",
      optional: true,
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
      limit: 100,
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
        if (this.sectionName && !section.name.includes(this.sectionName)) continue;
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
