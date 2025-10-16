import harvest from "../../harvest.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "harvest-get-projects",
  name: "Get Projects",
  description: "Retrieve data for a project or projects. [See docs here](https://help.getharvest.com/api-v2/projects-api/projects/projects/#list-all-projects)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    harvest,
    accountId: {
      propDefinition: [
        harvest,
        "accountId",
      ],
    },
    projectIds: {
      propDefinition: [
        harvest,
        "projectId",
        (c) => ({
          accountId: c.accountId,
        }),
      ],
      type: "string[]",
      description: "Array of project IDs",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      accountId, projectIds,
    } = this;

    if (projectIds && !Array.isArray(projectIds)) {
      throw new ConfigurationError("Project IDs must be an array");
    }

    const results = [];

    if (projectIds) {
      for (const projectId of projectIds) {
        const project = await this.harvest.getProject({
          $,
          projectId,
          accountId,
        });
        results.push(project);
      }
    } else {
      const projects = await this.harvest.listProjectsPaginated({
        page: 1,
        accountId,
      });
      for await (const project of projects) {
        results.push(project);
      }
    }

    results && $.export("$summary", `Successfully retrieved ${results?.length} project(s).`);
    return results;
  },
};
