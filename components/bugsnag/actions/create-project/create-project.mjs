import bugsnag from "../../bugsnag.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "bugsnag-create-project",
  name: "Create Project",
  description: "Create a new project for a specific organization in Bugsnag. [See the documentation](https://bugsnagapiv2.docs.apiary.io/#reference/projects/projects/create-a-project-in-an-organization)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    bugsnag,
    organizationId: {
      propDefinition: [
        bugsnag,
        "organizationId",
      ],
    },
    name: {
      type: "string",
      label: "Project Name",
      description: "The name of the project",
    },
    type: {
      type: "string",
      label: "Project Type",
      description: "The new project's framework type",
      options: constants.PROJECT_TYPES,
    },
    ignoreOldBrowsers: {
      type: "boolean",
      label: "Ignore Old Browsers",
      description: "For javascript projects this will filter errors from older browsers",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.bugsnag.createProject({
      $,
      organizationId: this.organizationId,
      data: {
        name: this.name,
        type: this.type,
        ignore_old_browsers: this.ignoreOldBrowsers,
      },
    });

    $.export("$summary", `Created project: ${this.name}`);
    return response;
  },
};
