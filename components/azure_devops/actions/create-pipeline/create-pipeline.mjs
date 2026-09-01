// x-pd-ai: optimized
import azureDevops from "../../azure_devops.app.mjs";
import {
  PIPELINE_CONFIGURATION_TYPE,
  PIPELINE_REPOSITORY_TYPE,
  PIPELINE_ROOT_FOLDER,
} from "../../common/constants.mjs";

export default {
  key: "azure_devops-create-pipeline",
  name: "Create Pipeline",
  description: "Create a YAML pipeline from a definition file already committed to a Git repository. Returns the new pipeline's id and name. The YAML file must exist before this call - push it first. Use this to register a new service's CI. Example: name `fabrikam-api-CI` from `/azure-pipelines.yml`. [See the documentation](https://learn.microsoft.com/en-us/rest/api/azure/devops/pipelines/pipelines/create?view=azure-devops-rest-7.1)",
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
    pipelineName: {
      type: "string",
      label: "Pipeline Name",
      description: "Name of the new pipeline",
    },
    repositoryId: {
      propDefinition: [
        azureDevops,
        "repositoryId",
      ],
      description: "ID of the repository holding the YAML file. The repository ID is required here - names are not accepted. Run the **List Repositories** action first to obtain valid values.",
    },
    yamlPath: {
      propDefinition: [
        azureDevops,
        "filePath",
      ],
      label: "YAML Path",
      description: "Repository-relative path of the pipeline definition, e.g. `/azure-pipelines.yml`. Defaults to `/azure-pipelines.yml`.",
      default: "/azure-pipelines.yml",
    },
    folder: {
      type: "string",
      label: "Folder",
      description: "Pipeline folder to create the pipeline in. Defaults to the root folder.",
      default: PIPELINE_ROOT_FOLDER,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.azureDevops.createPipeline({
      $,
      organization: this.organization,
      project: this.project,
      data: {
        name: this.pipelineName,
        folder: this.folder,
        configuration: {
          type: PIPELINE_CONFIGURATION_TYPE,
          path: this.yamlPath,
          repository: {
            id: this.repositoryId,
            type: PIPELINE_REPOSITORY_TYPE,
          },
        },
      },
    });
    $.export("$summary", `Created pipeline ${response.id}: ${response.name}`);
    return response;
  },
};
