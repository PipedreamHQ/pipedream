// x-pd-ai: optimized
import azureDevops from "../../azure_devops.app.mjs";

export default {
  key: "azure_devops-create-or-update-wiki-page",
  name: "Create Or Update Wiki Page",
  description: "Create a wiki page, or replace the content of an existing one. Returns the resulting page and its version. This replaces the whole page rather than appending, so read the page first if you need to preserve existing content. Use this to publish generated documentation. Example: page path `/Runbooks/Deploy`, Markdown content. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/wiki/pages/create-or-update?view=azure-devops-rest-7.1)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
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
    },
    content: {
      propDefinition: [
        azureDevops,
        "content",
      ],
      description: "Markdown content of the page. This replaces the whole page.",
    },
    comment: {
      propDefinition: [
        azureDevops,
        "wikiComment",
      ],
    },
  },
  async run({ $ }) {
    const etag = await this.azureDevops.getWikiPageVersion({
      $,
      organization: this.organization,
      project: this.project,
      wikiIdentifier: this.wikiIdentifier,
      params: {
        path: this.path,
      },
    });

    const response = await this.azureDevops.createOrUpdateWikiPage({
      $,
      organization: this.organization,
      project: this.project,
      wikiIdentifier: this.wikiIdentifier,
      params: {
        path: this.path,
        comment: this.comment,
      },
      headers: etag
        ? {
          "If-Match": etag,
        }
        : undefined,
      data: {
        content: this.content,
      },
    });
    $.export("$summary", `${etag
      ? "Updated"
      : "Created"} wiki page ${this.path}`);
    return response;
  },
};
