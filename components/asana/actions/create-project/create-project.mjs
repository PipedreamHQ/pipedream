import asana from "../../asana.app.mjs";
import constants from "../common/constants.mjs";

export default {
  key: "asana-create-project",
  name: "Create Project",
  description: "Create a new project in a workspace or team. [See the documentation](https://developers.asana.com/docs/create-a-project)",
  version: "0.10.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    asana,
    workspace: {
      label: "Workspace",
      description: "GID of a workspace.",
      type: "string",
      propDefinition: [
        asana,
        "workspaces",
      ],
    },
    team: {
      propDefinition: [
        asana,
        "teams",
        ({ workspace }) => ({
          workspace,
        }),
      ],
      type: "string",
      label: "Team",
      description: "The team that this project is shared with. If the workspace for your project is an organization, you must supply a team to share the project with",
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
    color: {
      label: "Color",
      description: "The color associated with the status update",
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
    defaultView: {
      label: "Default View",
      description: "The default view (list, board, calendar, or timeline) of a project",
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
    privacySetting: {
      label: "Privacy Setting",
      description: "The privacy setting of the project. Note: Administrators in your organization may restrict the values of `privacy_setting`.",
      type: "string",
      optional: true,
      options: [
        "public_to_workspace",
        "private_to_team",
        "private",
      ],
    },
    archived: {
      label: "Archived",
      description: "Archived projects do not show in the UI by default and may be treated differently for queries",
      type: "boolean",
      optional: true,
      default: false,
    },
    dueOn: {
      label: "Due On",
      description: "The day on which this project is due. This takes a date with format YYYY-MM-DD.",
      type: "string",
      optional: true,
    },
    startOn: {
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
        ({ workspace }) => ({
          workspace,
        }),
      ],
    },
    htmlNotes: {
      label: "HTML Notes",
      description: "The notes of the project with formatting as HTML",
      type: "string",
      optional: true,
    },
    owner: {
      label: "Owner",
      description: "The current owner of the project",
      type: "string",
      optional: true,
      propDefinition: [
        asana,
        "users",
        ({ workspace }) => ({
          workspace,
        }),
      ],
    },
    defaultAccessLevel: {
      type: "string",
      label: "Default Access Level",
      description: "The default access for users or teams who join or are added as members to the project",
      optional: true,
      options: [
        "admin",
        "editor",
        "commenter",
        "viewer",
      ],
    },
    minimumAccessLevelForCustomization: {
      type: "string",
      label: "Minimum Access Level for Customization",
      description: "The minimum access level needed for project members to modify this project's workflow and appearance",
      optional: true,
      options: [
        "admin",
        "editor",
      ],
    },
    minimumAccessLevelForSharing: {
      type: "string",
      label: "Minimum Access Level for Sharing",
      description: "The minimum access level needed for project members to share the project with others",
      optional: true,
      options: [
        "admin",
        "editor",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.asana._makeRequest({
      path: "projects",
      method: "post",
      data: {
        data: {
          name: this.name,
          notes: this.notes,
          team: this.team,
          color: this.color,
          workspace: this.workspace,
          default_view: this.defaultView,
          title: this.title,
          privacy_setting: this.privacySetting,
          archived: this.archived,
          due_on: this.dueOn,
          start_on: this.startOn,
          followers: this.followers,
          html_notes: this.htmlNotes,
          owner: this.owner,
          default_access_level: this.defaultAccessLevel,
          minimum_access_level_for_customization: this.minimumAccessLevelForCustomization,
          minimum_access_level_for_sharing: this.minimumAccessLevelForSharing,
        },
      },
      $,
    });

    $.export("$summary", `Successfully created project with GID: ${response.data.gid}`);

    return response;
  },
};
