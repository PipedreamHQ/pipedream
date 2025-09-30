import f15five from "../../f15five.app.mjs";

export default {
  key: "f15five-create-high-five",
  name: "Create High Five",
  description: "Create a High five within a company. [See the documentation](https://my.15five.com/api/public/#tag/High-Five/paths/~1api~1public~1high-five~1/post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    f15five,
    user: {
      propDefinition: [
        f15five,
        "user",
      ],
      description: "ID of the user creating the high five",
    },
    text: {
      type: "string",
      label: "Text",
      description: "Text of the high five. You must include the @mention of the persons, and/or the emails mention",
    },
  },
  async run({ $ }) {
    const response = await this.f15five.createHighFive({
      data: {
        creator_id: this.user,
        text: this.text,
      },
      $,
    });

    if (response) {
      $.export("$summary", `Successfully created high-five with ID ${response.id}`);
    }

    return response;
  },
};
