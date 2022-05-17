import common from "../common/common.mjs";

export default {
  key: "asana-search-sections",
  name: "Search Sections",
  description: "Searches for a section by name within a particular project. [See the docs here](https://developers.asana.com/docs/get-sections-in-a-project)",
  version: "0.2.0",
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
    const sections = await this.asana.getSections(this.project, $);

    $.export("$summary", "Successfully retrieved sections");

    if (this.name) return sections.filter((section) => section.name.includes(this.name));
    else return sections;
  },
};
