import lokalise from "../../lokalise.app.mjs";

export default {
  key: "lokalise-create-project",
  name: "Create Project",
  description: "Initializes an empty project in Lokalise. [See the documentation](https://developers.lokalise.com/reference/create-a-project)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    lokalise,
    name: {
      type: "string",
      label: "Name",
      description: "Name of the project",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the project",
      optional: true,
    },
    language: {
      propDefinition: [
        lokalise,
        "language",
      ],
      optional: true,
    },
    projectType: {
      type: "string",
      label: "Project Type",
      description: "The type of project",
      options: [
        "localization_files",
        "paged_documents",
      ],
      optional: true,
    },
    isSegmentationEnabled: {
      type: "boolean",
      label: "Is Segmentation Enabled",
      description: "Whether to enable Segmentation feature for project",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.lokalise.createProject({
      $,
      data: {
        name: this.name,
        description: this.description,
        base_lang_iso: this.language,
        project_type: this.projectType,
        is_segmentation_enabled: this.isSegmentationEnabled,
      },
    });
    $.export("$summary", `Successfully created project with ID: ${response.project_id}`);
    return response;
  },
};
