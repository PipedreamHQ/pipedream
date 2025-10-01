import app from "../../merge.app.mjs";

export default {
  key: "merge-create-activity",
  name: "Create Activity",
  description: "Creates an Activity object with the given values. [See the documentation](https://docs.merge.dev/ats/activities/#activities_create)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    user: {
      propDefinition: [
        app,
        "user",
      ],
    },
    activityType: {
      propDefinition: [
        app,
        "activityType",
      ],
    },
    subject: {
      propDefinition: [
        app,
        "subject",
      ],
    },
    body: {
      propDefinition: [
        app,
        "body",
      ],
    },
    visibility: {
      propDefinition: [
        app,
        "visibility",
      ],
    },
    candidate: {
      propDefinition: [
        app,
        "candidate",
      ],
    },
    remoteUserId: {
      propDefinition: [
        app,
        "remoteUserId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createActivity({
      $,
      data: {
        model: {
          user: this.user,
          activity_type: this.activityType,
          subject: this.subject,
          body: this.body,
          visibility: this.visibility,
          candidate: this.candidate,
        },
        remote_user_id: this.remoteUserId,
      },
    });

    $.export("$summary", `Successfully created the activity with the ID ${response.model.id}`);

    return response;
  },
};
