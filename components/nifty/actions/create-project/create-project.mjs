import {
  ACCESS_TYPE_OPTIONS, DEFAULT_TASK_VIEW_OPTIONS,
} from "../../common/constants.mjs";
import nifty from "../../nifty.app.mjs";

export default {
  key: "nifty-create-project",
  name: "Create Project",
  description: "Creates a new project in a designated portfolio. [See the documentation](https://openapi.niftypm.com/api#/Projects/ProjectAPIController_createProject)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    nifty,
    name: {
      type: "string",
      label: "Project Name",
      description: "The name of the project to create.",
    },
    description: {
      type: "string",
      label: "Project Description",
      description: "The description of the project.",
      optional: true,
    },
    templateId: {
      propDefinition: [
        nifty,
        "templateId",
      ],
      optional: true,
    },
    niceId: {
      type: "string",
      label: "Project Shortname",
      description: "Shortname is used as task ID prefix.",
      optional: true,
    },
    accessType: {
      type: "string",
      label: "Access Type",
      description: "The privacy of the project.",
      options: ACCESS_TYPE_OPTIONS,
      optional: true,
    },
    defaultTaskView: {
      type: "string",
      label: "Default Task View",
      description: "Select the default view for your task board.",
      options: DEFAULT_TASK_VIEW_OPTIONS,
      optional: true,
    },
    disabled: {
      type: "string[]",
      label: "Disabled",
      description: "disabled",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.nifty.createProject({
      $,
      data: {
        name: this.name,
        description: this.description,
        template_id: this.templateId,
        nice_id: this.niceId,
        access_type: this.accessType,
        default_tasks_view: this.defaultTaskView,
      },
    });
    $.export("$summary", `Successfully created project with ID: ${response.id}`);
    return response;
  },
};
