// x-pd-ai: optimized
import azureDevops from "../../azure_devops.app.mjs";

export default {
  key: "azure_devops-delete-wiki-page",
  name: "Delete Wiki Page",
  description: "Delete a wiki page. Returns the deleted page's path and the wiki commit the deletion created. Use this to retire documentation that has moved elsewhere. Example: page path `/Guides/Onboarding`. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/wiki/pages/delete-page?view=azure-devops-rest-7.1)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    azureDevops,
    organization: {
      propDefinition: [
        azureDevops,
        "organizationName",
      ],
    },
    project: {
      propDefinition: [
        azureDevops,
        "project",
      ],
    },
    wikiIdentifier: {
      propDefinition: [
        azureDevops,
        "wikiIdentifier",
      ],
    },
    path: {
      propDefinition: [
        azureDevops,
        "wikiPagePath",
      ],
      description: "Path of the wiki page to delete, e.g. `/Guides/Onboarding`",
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "Message recorded against the wiki commit this deletion creates",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.azureDevops.deleteWikiPage({
      $,
      organization: this.organization,
      project: this.project,
      wikiIdentifier: this.wikiIdentifier,
      params: {
        path: this.path,
        comment: this.comment,
      },
    });
    $.export("$summary", `Deleted wiki page ${this.path}`);
    return response;
  },
};
