import app from "../../upkeep.app.mjs";

export default {
  type: "action",
  key: "upkeep-create-request",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Create Request",
  description: "Create a Request, [See the docs](https://developers.onupkeep.com/#create-a-request)",
  props: {
    app,
    title: {
      propDefinition: [
        app,
        "title",
      ],
      description: "Title of the Request",
    },
    description: {
      propDefinition: [
        app,
        "description",
      ],
      label: "Description",
      description: "",
    },
    priority: {
      propDefinition: [
        app,
        "priority",
      ],
    },
    locationId: {
      propDefinition: [
        app,
        "locationId",
      ],
    },
    assetId: {
      propDefinition: [
        app,
        "assetId",
      ],
    },
    teamId: {
      propDefinition: [
        app,
        "teamId",
      ],
    },
    userId: {
      propDefinition: [
        app,
        "userId",
      ],
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "Due date, timestamp in milliseconds, e.g. `2018-01-09T07:20:22.310Z`",
      optional: true,
    },
  },
  async run ({ $ }) {
    const { result } = await this.app.createRequest({
      $,
      data: {
        title: this.title,
        description: this.description,
        priority: parseInt(this.priority),
        location: this.locationId,
        asset: this.assetId,
        team: this.teamId,
        assignedToUser: this.userId,
        dueDate: this.dueDate,
      },
    });
    $.export("$summary", `Request with ID ${result.id} has been created.`);
    return result;
  },
};
