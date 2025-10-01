import app from "../../chatbot_builder.app.mjs";
import qs from "qs";

export default {
  key: "chatbot_builder-create-tag",
  name: "Create Tag",
  description: "Creates a new tag in Chatbot Builder. [See the documentation](https://app.chatgptbuilder.io/api/swagger/#/accounts/createtag)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createTag({
      $,
      data: qs.stringify({
        name: this.name,
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    $.export("$summary", `Successfully created a new tag named ${this.name}`);
    return response;
  },
};
