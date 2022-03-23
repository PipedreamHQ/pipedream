// legacy_hash_id: a_k6iYPz
import asana from "../../asana.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "asana-search-sections",
  name: "Search Sections",
  description: "Searches for a section by name within a particular project.",
  version: "0.2.1",
  type: "action",
  props: {
    asana,
    project_gid: {
      label: "Project GID",
      description: "Globally unique identifier for the project.",
      type: "string",
      propDefinition: [
        asana,
        "projects",
      ],
    },
    name: {
      label: "Name",
      description: "The name of the section to search for.",
      type: "string",
    },
  },
  async run({ $ }) {
    const sections = await axios($, {
      url: `${this.asana._apiUrl()}/projects/${this.project_gid}/sections`,
      headers: this.asana._headers(),
    });

    if (this.name) return sections.data.filter((section) => section.name.includes(this.name));
    else return sections.data;
  },
};
