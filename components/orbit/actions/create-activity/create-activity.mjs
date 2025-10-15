import app from "../../orbit.app.mjs";

export default {
  name: "Create Activity",
  description: "Create a new activity. [See the docs here](https://api.orbit.love/reference/post_workspace-slug-members-member-slug-activities)",
  key: "orbit-create-activity",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    workspaceSlug: {
      propDefinition: [
        app,
        "workspaceSlug",
      ],
    },
    workspaceMemberSlug: {
      propDefinition: [
        app,
        "workspaceMemberSlug",
        ({ workspaceSlug }) => ({
          workspaceSlug,
        }),
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "A title for the activity; displayed in the timeline",
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description for the activity; displayed in the timeline",
      optional: true,
    },
    link: {
      type: "string",
      label: "Link",
      description: "A URL for the activity; displayed in the timeline",
      optional: true,
    },
    linkText: {
      type: "string",
      label: "Link Text",
      description: "The text for the timeline link",
      optional: true,
    },
    weight: {
      type: "integer",
      label: "Weight",
      description: "A custom weight to be used in filters and reports; defaults to 1.",
      optional: true,
    },
    activityTypeKey: {
      type: "string",
      label: "Activity Type Key",
      description: "The key for a custom activity type for the workspace. Will create a new activity type if it does not exist.",
      optional: true,
    },
    occurredAt: {
      type: "string",
      label: "Occurred At",
      description: "The date and time the activity occurred; defaults to now.",
      optional: true,
    },
    properties: {
      type: "object",
      label: "Properties",
      description: "Key-value pairs to provide contextual metadata about an activity.",
      optional: true,
    },
  },
  async run({ $ }) {
    const activity = {
      title: this.title,
      description: this.description,
      link: this.link,
      link_text: this.linkText,
      weight: this.weight,
      activity_type_key: this.activityTypeKey,
      occurred_at: this.occurredAt,
      properties: this.properties,
    };
    const res = await this.app.createActivity(
      this.workspaceSlug,
      this.workspaceMemberSlug,
      activity,
    );
    $.export("$summary", `Activity successfully created with id "${res.data.id}"`);
    return res;
  },
};
