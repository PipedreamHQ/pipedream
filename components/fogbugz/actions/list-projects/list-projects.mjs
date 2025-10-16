import fogbugz from "../../fogbugz.app.mjs";

export default {
  key: "fogbugz-list-projects",
  name: "List Projects",
  description: "Gets a list of projects in FogBugz. This can be used to quickly view all projects and their details. [See the documentation](https://support.fogbugz.com/hc/en-us/articles/360011242334-FogBugz-XML-API-Lists)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    fogbugz,
    fWrite: {
      type: "boolean",
      label: "fWrite",
      description: "Set to 1 if you only want the list of projects you have permission to write to (i.e. can edit the cases in this project). If this is left off or set to 0, then the API assumes you are looking for all areas that you have permission to read.",
      optional: true,
    },
    fIncludeDeleted: {
      type: "boolean",
      label: "Include Deleted",
      description: "Set to 1 to include deleted projects in the results.",
      optional: true,
    },
  },
  methods: {
    async listProjects({
      data, ...opts
    }) {
      return await this.fogbugz.post({
        data: {
          cmd: "listProjects",
          ...data,
        },
        ...opts,
      });
    },
  },
  async run({ $ }) {
    const response = await this.listProjects({
      $,
      data: {
        fWrite: this.fWrite,
        fIncludeDeleted: this.fIncludeDeleted,
      },
    });
    $.export("$summary", "Successfully retrieved the list of projects");
    return response;
  },
};
