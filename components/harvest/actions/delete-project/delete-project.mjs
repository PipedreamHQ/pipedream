import harvest from "../../harvest.app.mjs";

export default {
  key: "harvest-delete-project",
  name: "Delete Project",
  description: "Permanently delete a project and all time entries and expenses tracked to it (invoices are not deleted). Use **Get Projects** to find a project ID. Example: call with projectId set to a project's ID to permanently remove it. [See the documentation](https://help.getharvest.com/api-v2/projects-api/projects/projects/#delete-a-project).",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    openWorldHint: true,
  },
  props: {
    harvest,
    accountId: {
      propDefinition: [
        harvest,
        "accountId",
      ],
    },
    projectId: {
      propDefinition: [
        harvest,
        "projectId",
      ],
    },
  },
  async run({ $ }) {
    await this.harvest.deleteProject({
      $,
      projectId: this.projectId,
      accountId: this.accountId,
    });
    $.export("$summary", `Successfully deleted project ${this.projectId}`);
  },
};
