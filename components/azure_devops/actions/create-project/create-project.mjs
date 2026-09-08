import azureDevops from "../../azure_devops.app.mjs";
import {
  AGILE_PROCESS_TEMPLATE_ID,
  PROJECT_VISIBILITY_OPTIONS,
  SOURCE_CONTROL_TYPE_OPTIONS,
} from "../../common/constants.mjs";

export default {
  key: "azure_devops-create-project",
  name: "Create Project",
  description: "Queue creation of a new project. Project creation is asynchronous, so this returns an operation reference rather than the finished project - poll the project list to see it appear. Use when onboarding a new team or product area. Example: name `Payments Platform`, visibility `private`, Agile process. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/core/projects/create?view=azure-devops-rest-7.1)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
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
    projectName: {
      type: "string",
      label: "Project Name",
      description: "Name of the new project (max 64 chars, cannot contain `/ : \\ ~ & % ; @ ' \" ? < > | # $ * } { , + = [ ]`)",
    },
    description: {
      propDefinition: [
        azureDevops,
        "description",
      ],
      description: "Description of the new project",
    },
    visibility: {
      type: "string",
      label: "Visibility",
      description: "Whether the project is private or public. Public projects require the organization to allow public projects. Defaults to `private`.",
      options: PROJECT_VISIBILITY_OPTIONS,
      default: "private",
      optional: true,
    },
    sourceControlType: {
      type: "string",
      label: "Source Control Type",
      description: "Version control system used by the project. Defaults to `Git`.",
      options: SOURCE_CONTROL_TYPE_OPTIONS,
      default: "Git",
      optional: true,
    },
    processTemplateId: {
      type: "string",
      label: "Process Template ID",
      description: "GUID of the process template to base the project on. Defaults to the built-in Agile template. Run the **List Processes** action first to obtain other valid values.",
      default: AGILE_PROCESS_TEMPLATE_ID,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.azureDevops.createProject({
      $,
      organization: this.organization,
      data: {
        name: this.projectName,
        description: this.description,
        visibility: this.visibility,
        capabilities: {
          versioncontrol: {
            sourceControlType: this.sourceControlType,
          },
          processTemplate: {
            templateTypeId: this.processTemplateId,
          },
        },
      },
    });
    $.export("$summary", `Queued creation of project "${this.projectName}" (operation ${response.id})`);
    return response;
  },
};
