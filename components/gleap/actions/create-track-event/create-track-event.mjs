import gleap from "../../gleap.app.mjs";

export default {
  key: "gleap-create-track-event",
  name: "Create Track Event",
  description: "Creates a new track event in Gleap. [See the documentation](https://docs.gleap.io/server/rest-api#track-events)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    gleap,
    name: {
      propDefinition: [
        gleap,
        "name",
      ],
    },
    data: {
      propDefinition: [
        gleap,
        "data",
      ],
    },
    date: {
      propDefinition: [
        gleap,
        "date",
      ],
    },
    projectId: {
      propDefinition: [
        gleap,
        "projectId",
      ],
    },
    userId: {
      propDefinition: [
        gleap,
        "userId",
        ({ projectId }) => ({
          projectId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.gleap.trackEvent({
      $,
      data: {
        events: [
          {
            date: this.date,
            name: this.name,
            data: this.data,
            userId: this.userId,
          },
        ],
      },
    });

    $.export("$summary", `Successfully created track event ${this.name}.`);
    return response;
  },
};
