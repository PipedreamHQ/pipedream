// legacy_hash_id: a_k6iYPz
import { axios } from "@pipedream/platform";

export default {
  key: "asana-search-sections",
  name: "Find Section in Project",
  description: "Searches for a section by name within a particular project.",
  version: "0.1.2",
  type: "action",
  props: {
    asana: {
      type: "app",
      app: "asana",
    },
    project_gid: {
      type: "string",
      description: "Globally unique identifier for the project.",
    },
    name: {
      type: "string",
      description: "The name of the section to search for.",
    },
    opt_pretty: {
      type: "boolean",
      description: "Provides pretty output.",
      optional: true,
    },
    opt_fields: {
      type: "any",
      description: "Defines fields to return.",
      optional: true,
    },
  },
  async run({ $ }) {
    let sections = null;
    let matches = [];
    let projectGid = this.project_gid;
    let query = this.name;

    const asanaParams = [
      "opt_pretty",
      "opt_fields",
    ];
    let p = this;

    const queryString = asanaParams.filter((param) => p[param]).map((param) => `${param}=${p[param]}`)
      .join("&");

    sections = await axios($, {
      url: `https://app.asana.com/api/1.0/projects/${projectGid}/sections?${queryString}`,
      headers: {
        Authorization: `Bearer ${this.asana.$auth.oauth_access_token}`,
      },
    });
    if (sections) {
      sections.data.forEach(function(section) {
        if (section.name.includes(query))
          matches.push(section);
      });
    }

    return matches;
  },
};
