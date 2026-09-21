import azureDevops from "../../azure_devops.app.mjs";

export default {
  key: "azure_devops-get-user",
  name: "Get User",
  description: "Retrieve one user by their graph descriptor. Returns their display name, principal name, mail address and origin. Use this to confirm an identity before assigning work to them. Example: descriptor `aad.OGViYWJmMDQtMGIwOC03YTQz`. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/graph/users/get?view=azure-devops-rest-7.1)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
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
    userDescriptor: {
      type: "string",
      label: "User Descriptor",
      description: "Graph descriptor of the user, e.g. `aad.YzE0ZDkxOG...`. Run the **List Users** action first to obtain valid values.",
    },
  },
  async run({ $ }) {
    const response = await this.azureDevops.getGraphUser({
      $,
      organization: this.organization,
      userDescriptor: this.userDescriptor,
    });
    $.export("$summary", `Retrieved user ${response.displayName ?? response.principalName}`);
    return response;
  },
};
