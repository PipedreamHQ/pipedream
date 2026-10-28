import harvest from "../../harvest.app.mjs";

export default {
  key: "harvest-get-project",
  name: "Get Project",
  description: "Retrieve a single project by ID. Example: call with projectId set to a known project's ID to see its client, budget, and billing method. [See the documentation](https://help.getharvest.com/api-v2/projects-api/projects/projects/#retrieve-a-project).",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
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
    const response = await this.harvest.getProject({
      $,
      projectId: this.projectId,
      accountId: this.accountId,
    });
    $.export("$summary", `Successfully retrieved project ${response.id}: ${response.name}`);
    return response;
  },
};
