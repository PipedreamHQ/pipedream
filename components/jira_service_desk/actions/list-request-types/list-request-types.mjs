// x-pd-ai: optimized
import app from "../../jira_service_desk.app.mjs";

export default {
  key: "jira_service_desk-list-request-types",
  name: "List Request Types",
  description:
    "Lists the customer request types a service desk offers, with the `id`, `name`, and `description` of each."
    + " Call this before **Create Request** to choose the `requestTypeId` that matches what the user is asking for: the request type, not the summary wording, decides what kind of ticket gets created."
    + " Names vary by desk, so match on meaning rather than assuming a type called \"Incident\" exists (an IT desk may instead offer \"Report a system problem\")."
    + " Use **List Sites** for `cloudId` and **List Service Desks** for `serviceDeskId`."
    + " Results are paginated automatically up to `maxResults`."
    + " Returns `{ requestTypes, truncated }`, where `truncated` is `true` when more types remained unfetched."
    + " Example: service desk `1` returns entries such as `{ \"id\": \"8\", \"name\": \"Report a system problem\", \"description\": \"Let us know if something isn't working properly\", \"canCreateRequest\": true }`."
    + " Types with `canCreateRequest: false` cannot be used to raise a request."
    + " Then call **List Request Type Fields** to see what the chosen type requires."
    + " [See the documentation](https://developer.atlassian.com/cloud/jira/service-desk/rest/api-group-servicedesk/#api-rest-servicedeskapi-servicedesk-servicedeskid-requesttype-get)",
  version: "0.0.1",
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
    serviceDeskId: {
      propDefinition: [
        app,
        "serviceDeskId",
        ({ cloudId }) => ({
          cloudId,
        }),
      ],
      description: "The service desk whose request types to list. Use **List Service Desks** to find valid IDs (e.g. `1`).",
    },
    searchQuery: {
      type: "string",
      label: "Search Query",
      description: "Filter results to request types matching this text, e.g. `hardware`. Omit to return every type the desk offers.",
      optional: true,
    },
    groupId: {
      type: "integer",
      label: "Group ID",
      description: "Filter results to a single request type group. Group IDs appear as `groupIds` on the request types returned by this action.",
      optional: true,
    },
    restrictionStatus: {
      type: "string",
      label: "Restriction Status",
      description: "Filter by whether the request type is open to all customers or restricted.",
      options: [
        "open",
        "restricted",
      ],
      optional: true,
    },
    includeHiddenRequestTypesInSearch: {
      type: "boolean",
      label: "Include Hidden Request Types In Search",
      description: "Whether to include hidden request types. Only applies together with `searchQuery`.",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
    expand: {
      propDefinition: [
        app,
        "expand",
      ],
      description: "Extra data to include on each request type. Pass `[\"field\"]` to return the type's fields inline, which saves a follow-up **List Request Type Fields** call. `field` is the only value this endpoint accepts.",
    },
  },
  async run({ $ }) {
    const {
      results, hasMore,
    } = await this.app.getRequestTypes({
      $,
      cloudId: this.cloudId,
      serviceDeskId: this.serviceDeskId,
      maxResults: this.maxResults,
      params: {
        searchQuery: this.searchQuery,
        groupId: this.groupId,
        restrictionStatus: this.restrictionStatus,
        includeHiddenRequestTypesInSearch: this.includeHiddenRequestTypesInSearch,
        expand: this.expand,
      },
    });

    const requestTypes = results.map(({
      id, name, description, helpText, issueTypeId, serviceDeskId, groupIds, canCreateRequest,
      fields,
    }) => ({
      id,
      name,
      description,
      helpText,
      issueTypeId,
      serviceDeskId,
      groupIds,
      canCreateRequest,
      fields,
    }));

    $.export("$summary", `Found ${requestTypes.length} request type${requestTypes.length === 1
      ? ""
      : "s"}${hasMore
      ? ", truncated at Max Results; raise it to fetch more"
      : ""}`);
    return {
      requestTypes,
      truncated: hasMore,
    };
  },
};
