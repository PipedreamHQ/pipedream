import notion from "../../notion.app.mjs";

export default {
  key: "notion-retrieve-user",
  name: "Retrieve User",
  description: "Returns a user using the ID specified. [See the documentation](https://developers.notion.com/reference/get-user)",
  version: "0.0.3",
  type: "action",
  props: {
    notion,
    userId: {
      propDefinition: [
        notion,
        "userId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.notion.getUser(this.userId);
    $.export("$summary", `Successfully retrieved user with ID ${this.userId}`);
    return response;
  },
};
