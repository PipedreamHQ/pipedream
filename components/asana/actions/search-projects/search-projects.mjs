// legacy_hash_id: a_2wimKj
import { axios } from "@pipedream/platform";

export default {
  key: "asana-search-projects",
  name: "Search Projects",
  description: "Finds an existing project by name.",
  version: "0.1.1",
  type: "action",
  props: {
    asana: {
      type: "app",
      app: "asana",
    },
    name: {
      type: "string",
    },
  },
  async run({ $ }) {
    let projects = null;
    let matches = [];
    let query = this.name;

    projects = await axios($, {
      url: "https://app.asana.com/api/1.0/projects",
      headers: {
        Authorization: `Bearer ${this.asana.$auth.oauth_access_token}`,
      },
    });

    if (projects.data) {
      projects.data.forEach(function(project) {
        if (project.name.includes(query))
          matches.push(project);
      });
    }

    return matches;
  },
};
