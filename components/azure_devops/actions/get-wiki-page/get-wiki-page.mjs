// x-pd-ai: optimized
import azureDevops from "../../azure_devops.app.mjs";
import { WIKI_RECURSION_LEVEL_OPTIONS } from "../../common/constants.mjs";

export default {
  key: "azure_devops-get-wiki-page",
  name: "Get Wiki Page",
  description: "Read a wiki page and its Markdown content, optionally including its sub-pages. Returns the page path, content and order. Use this to read runbook or onboarding content into a workflow. Example: page path `/Guides/Onboarding`. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/wiki/pages/get-page?view=azure-devops-rest-7.1)",
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
    recursionLevel: {
      type: "string",
      label: "Recursion Level",
      description: "Include the page's sub-pages. Defaults to `none`.",
      options: WIKI_RECURSION_LEVEL_OPTIONS,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.azureDevops.getWikiPage({
      $,
      organization: this.organization,
      project: this.project,
      wikiIdentifier: this.wikiIdentifier,
      params: {
        path: this.path,
        includeContent: true,
        recursionLevel: this.recursionLevel,
      },
    });
    $.export("$summary", `Retrieved wiki page ${this.path}`);
    return response;
  },
};
