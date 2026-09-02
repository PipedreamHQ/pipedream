// x-pd-ai: optimized
import app from "../../jira_service_desk.app.mjs";

export default {
  key: "jira_service_desk-list-service-desks",
  name: "List Service Desks",
  description:
    "Lists every service desk on an Atlassian site, with the `id` and project details of each."
    + " Call this to discover the `serviceDeskId` required by **Create Request**, **List Request Types**, and **List My Requests** when you only know a project name or key."
    + " Use **List Sites** first to obtain the required `cloudId`."
    + " Results are paginated automatically up to `maxResults`."
    + " Returns `{ serviceDesks, truncated }`, where `truncated` is `true` when more desks remained unfetched."
    + " Example: a site with one desk returns `{ \"serviceDesks\": [{ \"id\": \"1\", \"projectName\": \"Support\", \"projectKey\": \"SUP\" }], \"truncated\": false }`."
    + " [See the documentation](https://developer.atlassian.com/cloud/jira/service-desk/rest/api-group-servicedesk/#api-rest-servicedeskapi-servicedesk-get)",
  version: "0.0.4",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    cloudId: {
      propDefinition: [
        app,
        "cloudId",
      ],
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const {
      results, hasMore,
    } = await this.app.getServiceDesks({
      $,
      cloudId: this.cloudId,
      maxResults: this.maxResults,
    });

    const serviceDesks = results.map(({
      id, projectId, projectName, projectKey, projectTypeKey,
    }) => ({
      id,
      projectId,
      projectName,
      projectKey,
      projectTypeKey,
    }));

    $.export("$summary", `Found ${serviceDesks.length} service desk${serviceDesks.length === 1
      ? ""
      : "s"}${hasMore
      ? ", truncated at Max Results; raise it to fetch more"
      : ""}`);
    return {
      serviceDesks,
      truncated: hasMore,
    };
  },
};
