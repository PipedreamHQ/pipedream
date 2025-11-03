import timeular from "../../timeular.app.mjs";

export default {
  key: "timeular-create-activity",
  name: "Create Activity",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Creates a new activity. [See the documentation](https://developers.timeular.com/#591f7ca0-7ec5-4c0e-b0d0-99b6967ce53e)",
  type: "action",
  props: {
    timeular,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the activity.",
    },
    color: {
      type: "string",
      label: "Color",
      description: "The Hex Color Code of the activity.",
    },
    spaceId: {
      propDefinition: [
        timeular,
        "spaceId",
      ],
    },
    integration: {
      propDefinition: [
        timeular,
        "integration",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      timeular,
      ...data
    } = this;

    const response = await timeular.createActivities({
      $,
      data: {
        ...data,
        scope: "timeular",
      },
    });

    $.export("$summary", `A new activity with Id: ${response.id} was successfully created!`);
    return response;
  },
};
