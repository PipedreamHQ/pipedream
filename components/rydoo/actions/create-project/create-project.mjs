import rydoo from "../../rydoo.app.mjs";

export default {
  key: "rydoo-create-project",
  name: "Create Project",
  description: "Sets up a new company project for expense allocation. [See the documentation](https://developers.rydoo.com/reference/v2projectsaddproject)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    rydoo,
    name: {
      type: "string",
      label: "Name",
      description: "Name of the project",
    },
    isActive: {
      type: "boolean",
      label: "Is Active",
      description: "Whether the project is currently active",
      optional: true,
    },
    refId: {
      type: "string",
      label: "Reference ID",
      description: "External reference identifier for the project",
      optional: true,
    },
    branch: {
      type: "string",
      label: "Branch",
      description: "Branch assignment for the project as a JSON object (e.g., `{\"id\": \"uuid\"}`)",
      optional: true,
    },
    limitedToGroups: {
      type: "string[]",
      label: "Limited To Groups",
      description: "Restrict project access to specific groups. Each entry must be a JSON object with a group `id` property (e.g., `{\"id\": \"uuid\"}`)",
      optional: true,
    },
    isDefaultForGroups: {
      type: "string[]",
      label: "Default For Groups",
      description: "Set the project as default for specific groups. Each entry must be a JSON object with a group `id` property (e.g., `{\"id\": \"uuid\"}`)",
      optional: true,
    },
    customFields: {
      type: "string[]",
      label: "Custom Fields",
      description: "Custom field values for the project. Each entry must be a JSON object with `key`, `value`, and optionally `valueCode` properties",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.rydoo.createProject({
      $,
      data: {
        name: this.name,
        isActive: this.isActive,
        refId: this.refId,
        branch: this.branch
          ? JSON.parse(this.branch)
          : undefined,
        limitedToGroups: this.limitedToGroups?.map((g) => JSON.parse(g)),
        isDefaultForGroups: this.isDefaultForGroups?.map((g) => JSON.parse(g)),
        customFields: this.customFields?.map((f) => JSON.parse(f)),
      },
    });

    $.export("$summary", `Successfully created project "${this.name}".`);
    return response;
  },
};
