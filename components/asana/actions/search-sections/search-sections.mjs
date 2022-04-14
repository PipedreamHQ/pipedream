import common from "../common/common.mjs";

export default {
  key: "asana-search-sections",
  name: "Search Sections",
  description: "Searches for a section by name within a particular project.",
  version: "0.2.1",
  type: "action",
  props: {
    ...common.props,
    name: {
      label: "Name",
      description: "The name of the section to search for.",
      type: "string",
    },
  },
  async run({ $ }) {
    const sections = await this.asana.getSections(this.project_gid, $);

    $.export("$summary", "Successfully retrieved sections");

    if (this.name) return sections.data.filter((section) => section.name.includes(this.name));
    else return sections.data;
  },
};
