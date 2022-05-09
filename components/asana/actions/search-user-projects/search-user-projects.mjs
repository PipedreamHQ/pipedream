// legacy_hash_id: a_Xzi4pK
import { axios } from "@pipedream/platform";

export default {
  key: "asana-search-user-projects",
  name: "Asana - Get list of user projects",
  description: "Return list of projects given the user and workspace gid",
  version: "0.3.3",
  type: "action",
  props: {
    asana: {
      type: "app",
      app: "asana",
    },
    opt_fields: {
      type: "string",
      description: "Fields to query for projects resource type",
    },
    limit: {
      type: "string",
      description: "Number of results returned per page. Max is 100",
    },
    workspace: {
      type: "string",
    },
    user_id: {
      type: "string",
      description: "Asana user GID",
    },
  },
  async run({ $ }) {
    //
    // Contributed to the pipedream community by https://taskforce.services
    //
    // Asana organizes work so teams know what to do, why it matters, and how to get it done.
    // https://tfs.link/asana
    //

    // Return list of projects given the user and workspace gid
    const optFields = this.opt_fields;
    const limit = this.limit; // returned number of items per call
    const workspace = this.workspace;
    let userProjects = [];
    let uri = `https://app.asana.com/api/1.0/projects/?opt_fields=${optFields}&archived=false&limit=${limit}&workspace=${workspace}`;
    const user = this.user_id;

    while (true) {
      let projects = await axios($, {
        url: uri,
        headers: {
          Authorization: `Bearer ${this.asana.$auth.oauth_access_token}`,
        },
      });

      if (projects.data.length > 0) {
        for (let item of projects.data) {
          if (item.members.length > 0) {
            let member = item.members.find((m) => m.gid == user);

            if (typeof member !== "undefined") {
              userProjects.push(item);
            }
          }
        }

        if (projects.next_page != null)
          // loop again to next page
          uri = projects.next_page.uri;
        else
          break;
      } else {
        break;
      }
    }

    $.export("projects", userProjects);

    if (userProjects.length == 0) {
      console.log("No project found for user: " + this.user_id);
      return null;
    }

    return userProjects;
  },
};
