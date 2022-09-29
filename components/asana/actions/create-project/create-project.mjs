import asana from "../../asana.app.mjs";
import constants from "../common/constants.mjs";

export default {
  key: "asana-create-project",
  name: "Create Project",
  description: "Create a new project in a workspace or team. [See the docs here](https://developers.asana.com/docs/create-a-project)",
  version: "0.9.1",
  type: "action",
  props: {
    asana,
    workspace: {
      label: "Workspace",
      description: "Gid of a workspace.",
      type: "string",
      propDefinition: [
        asana,
        "workspaces",
      ],
    },
    name: {
      label: "Name",
      description: "Name of the project. This is generally a short sentence fragment that fits on a line in the UI for maximum readability. However, it can be longer.",
      type: "string",
    },
    notes: {
      label: "Notes",
      description: "Free-form textual information associated with the project (ie., its description).",
      type: "string",
    },
    text: {
      label: "Text",
      description: "The text content of the status update.",
      type: "string",
    },
    color: {
      label: "Color",
      description: "The color associated with the status update.",
      type: "string",
      options: constants.COLORS,
      optional: true,
    },
    title: {
      label: "Title",
      description: "The title of the project status update.",
      type: "string",
      optional: true,
    },
    default_view: {
      label: "Default View",
      description: "The default view (list, board, calendar, or timeline) of a project.",
      type: "string",
      options: [
        "list",
        "board",
        "calendar",
        "timeline",
      ],
      default: "calendar",
      optional: true,
    },
    public: {
      label: "Public",
      description: "True if the project is public to its team.",
      type: "boolean",
      optional: true,
      default: false,
    },
    archived: {
      label: "Archived",
      description: "Archived projects do not show in the UI by default and may be treated differently for queries.",
      type: "boolean",
      optional: true,
      default: false,
    },
    due_on: {
      label: "Due On",
      description: "The day on which this project is due. This takes a date with format YYYY-MM-DD.",
      type: "string",
      optional: true,
    },
    start_on: {
      label: "Start On",
      description: "The day on which work for this project begins. This takes a date with format YYYY-MM-DD. `Due On` must be present in the request when setting or unsetting the `Start On` parameter. Additionally, `Start On` and `Due On` cannot be the same date.",
      type: "string",
      optional: true,
    },
    followers: {
      label: "Followers",
      description: "Comma separated string of users. Followers are a subset of members who have opted in to receive \"tasks added\" notifications for a project.",
      type: "string[]",
      optional: true,
      propDefinition: [
        asana,
        "users",
      ],
    },
    html_notes: {
      label: "HTML Notes",
      description: "The notes of the project with formatting as HTML.",
      type: "string",
      optional: true,
    },
    owner: {
      label: "Owner",
      description: "The current owner of the project.",
      type: "string",
      optional: true,
      propDefinition: [
        asana,
        "users",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.asana._makeRequest("projects", {
      method: "post",
      data: {
        data: {
          name: this.name,
          notes: this.notes,
          text: this.text,
          color: this.color,
          workspace: this.workspace,
          default_view: this.default_view,
          title: this.title,
          public: this.public,
          archived: this.archived,
          due_on: this.due_on,
          start_on: this.start_on,
          followers: this.followers,
          html_notes: this.html_notes,
          owner: this.owner,
        },
      },
    }, $);

    $.export("$summary", "Successfully created project");

    return response;
  },
};
