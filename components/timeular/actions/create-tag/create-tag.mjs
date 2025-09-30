import timeular from "../../timeular.app.mjs";

export default {
  key: "timeular-create-tag",
  name: "Create Tag",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Creates a new tag within the given space and scope. [See the documentation](https://developers.timeular.com/#d62392ca-2eb2-40c9-8d14-834ba581122e)",
  type: "action",
  props: {
    timeular,
    label: {
      type: "string",
      label: "Label",
      description: "The tag should start with # or @.",
    },
    spaceId: {
      propDefinition: [
        timeular,
        "spaceId",
      ],
    },
  },
  async run({ $ }) {
    const {
      timeular,
      ...data
    } = this;

    const response = await timeular.createTag({
      $,
      data: {
        ...data,
        scope: "timeular",
      },
    });

    $.export("$summary", `A new tag with Id: ${response.id} was successfully created!`);
    return response;
  },
};
