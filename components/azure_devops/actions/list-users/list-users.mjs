// x-pd-ai: optimized
import azureDevops from "../../azure_devops.app.mjs";
import { GRAPH_SUBJECT_TYPE_OPTIONS } from "../../common/constants.mjs";

export default {
  key: "azure_devops-list-users",
  name: "List Users",
  description: "List the users in an organization, optionally narrowed by subject type. Returns each user's display name, principal name, descriptor and origin id. Use this to resolve a person to the identity GUID that the pull request reviewer and creator inputs require. Example: subject type `aad` returns Jamal Hartnett and his descriptor. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/graph/users/list?view=azure-devops-rest-7.1)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    azureDevops,
    organization: {
      propDefinition: [
        azureDevops,
        "organizationName",
      ],
    },
    subjectTypes: {
      type: "string[]",
      label: "Subject Types",
      description: "Only return users of these subject types",
      options: GRAPH_SUBJECT_TYPE_OPTIONS,
      optional: true,
    },
    limit: {
      propDefinition: [
        azureDevops,
        "limit",
      ],
      description: "Maximum number of users to return (1-1000)",
    },
  },
  async run({ $ }) {
    const users = await this.azureDevops.paginate({
      limit: this.limit,
      fetchPage: ({ continuationToken }) => this.azureDevops.listGraphUsers({
        $,
        organization: this.organization,
        params: {
          subjectTypes: this.subjectTypes?.length
            ? this.subjectTypes.join(",")
            : undefined,
          continuationToken,
        },
        returnFullResponse: true,
      }),
    });
    $.export("$summary", `Found ${users.length} user${users.length === 1
      ? ""
      : "s"} in ${this.organization}`);
    return users;
  },
};
