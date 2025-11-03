import app from "../../parsio_io.app.mjs";

export default {
  key: "parsio_io-create-mailbox",
  name: "Create Mailbox",
  description: "Create a new mailbox in Parsio. [See the documentation](https://help.parsio.io/public-api/parsio-public-api#create-a-mailbox)",
  version: "0.0.1",
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
    const response = await this.app.createMailbox({
      $,
      data: {
        name: this.name,
      },
    });
    $.export("$summary", "Successfully created mailbox");
    return response;
  },
};
