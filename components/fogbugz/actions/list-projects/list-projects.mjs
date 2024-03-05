import fogbugz from "../../fogbugz.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "fogbugz-list-projects",
  name: "List Projects",
  description: "Gets a list of projects in FogBugz. This can be used to quickly view all projects and their details. [See the documentation](https://api.manuscript.com/)",
  version: "0.0.1",
  type: "action",
  props: {
    fogbugz,
  },
  async run({ $ }) {
    const response = await this.fogbugz.listProjects();
    $.export("$summary", "Successfully retrieved the list of projects");
    return response;
  },
};
