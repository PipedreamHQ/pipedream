import donethat from "../../donethat.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "donethat-list-projects",
  name: "List Projects",
  description: "List the DoneThat projects you own or can access through a team."
    + " Use it to find a project's `id` for **Update Project** or **Get Time Report**, and team IDs (the `teamId` field) for **Get Time Report**."
    + " Returns active projects only unless Include Archived is set."
    + " [See the documentation](https://donethat.ai/api-reference/projects)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    donethat,
    includeArchived: {
      type: "boolean",
      label: "Include Archived",
      description: "Whether to include archived projects, e.g. `true`. Defaults to `false`.",
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort By",
      description: "Sort key, newest first. One of `createdAt`, `updatedAt` or `usedAt`, e.g. `usedAt`. Defaults to `createdAt`.",
      options: constants.PROJECT_SORT_KEYS,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.donethat.listProjects({
      $,
      params: {
        includeArchived: this.includeArchived,
        sort: this.sort,
      },
    });

    const count = response.projects?.length ?? 0;
    $.export("$summary", `Found ${count} project${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};
