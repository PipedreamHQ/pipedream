import mailercloud from "../../mailercloud.app.mjs";

export default {
  key: "mailercloud-create-list",
  name: "Create List",
  description: "Creates a new list in the user's Mailercloud account. [See the documentation](https://apidoc.mailercloud.com/docs/mailercloud-api/0f2b429db85f5-create-a-new-list)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    mailercloud,
    name: {
      type: "string",
      label: "Name",
      description: "Your List name. Only alphanumeric characters, underscore, hyphen, dot and space allowed.",
    },
  },
  async run({ $ }) {
    const response = await this.mailercloud.createList({
      data: {
        name: this.name,
        list_type: 1,
      },
      $,
    });
    $.export("$summary", `Successfully created list: ${this.name}`);
    return response;
  },
};
