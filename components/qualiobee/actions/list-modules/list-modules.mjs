import qualiobee from "../../qualiobee.app.mjs";

export default {
  key: "qualiobee-list-modules",
  name: "List Modules",
  description: "List modules available in the Qualiobee organization. [See the documentation](https://app.qualiobee.fr/api/doc/#/Module/PublicModuleController_getMany)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    qualiobee,
    withDeleted: {
      type: "boolean",
      label: "With Deleted",
      description: "Whether to include deleted modules in the response",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Filter by name",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Filter by description",
      optional: true,
    },
    duration: {
      type: "string",
      label: "Duration",
      description: "Filter by duration",
      optional: true,
    },
    moduleUuid: {
      propDefinition: [
        qualiobee,
        "moduleUuid",
      ],
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "The page number to return",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of modules to return",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.qualiobee.listModules({
      $,
      params: {
        withDeleted: this.withDeleted,
        name: this.name,
        description: this.description,
        duration: this.duration,
        uuid: this.moduleUuid,
        page: this.page,
        limit: this.limit,
      },
    });
    $.export("$summary", `Successfully listed ${response.data?.length} module${response.data?.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
