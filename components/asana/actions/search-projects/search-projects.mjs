// legacy_hash_id: a_2wimKj
import asana from "../../asana.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  type: "action",
  key: "asana-search-projects",
  version: "0.2.1",
  name: "Search Projects",
  description: "Finds an existing project.",
  props: {
    asana,
    name: {
      label: "Name",
      description: "The name to filter projects on.",
      type: "string",
      optional: true,
    },
    workspace: {
      label: "Workspace",
      description: "The workspace or organization to filter projects on.",
      type: "string",
      optional: true,
      propDefinition: [
        asana,
        "workspaces",
      ],
    },
    archived: {
      label: "Archived",
      description: "Only return projects whose `archived` field takes on the value of this parameter.",
      type: "boolean",
      optional: true,
    },
  },
  async run({ $ }) {
    const projects = await axios($, {
      method: "get",
      url: `${this.asana._apiUrl()}/projects`,
      headers: this.asana._headers(),
      params: {
        workspace: this.workspace,
        archived: this.archived,
      },
    });

    if (this.name) return projects.data.filter((project) => project.name.includes(this.name));
    else return projects.data;
  },
};
