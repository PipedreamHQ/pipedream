import harvest from "../../harvest.app.mjs";
import constants from "../../common/constants.mjs";
import { ConfigurationError } from "@pipedream/platform";
import {
  mapWithRateLimit, withRetryAfter,
} from "../../common/utils.mjs";

export default {
  key: "harvest-get-projects",
  name: "Get Projects",
  description: `Retrieve one or more projects. Omit Project IDs to list every project in the account (up to ${constants.MAX_AUTO_PAGINATE_RECORDS}) — use this to discover project IDs for other Harvest tools. Provide Project IDs to fetch specific projects instead. Example: call with no Project IDs to find the ID for "Jurassic Park Construction" before creating a task assignment on it. [See the documentation](https://help.getharvest.com/api-v2/projects-api/projects/projects/#list-all-projects).`,
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
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
      ],
      type: "string[]",
      description: "Array of free-form project IDs, e.g. `[\"14308069\"]`. Omit this parameter to retrieve every project instead.",
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

    let results;

    if (projectIds) {
      results = await mapWithRateLimit(projectIds, (projectId) =>
        withRetryAfter(() => this.harvest.getProject({
          $,
          projectId,
          accountId,
        })));
    } else {
      results = [];
      const projects = await this.harvest.listProjectsPaginated({
        page: 1,
        $,
        accountId,
      });
      for await (const project of projects) {
        results.push(project);
        if (results.length >= constants.MAX_AUTO_PAGINATE_RECORDS) break;
      }
    }

    results && $.export("$summary", `Successfully retrieved ${results?.length} project(s).`);
    return results;
  },
};
