import app from "../../herobot_chatbot_marketing.app.mjs";

export default {
  key: "herobot_chatbot_marketing-create-custom-field",
  name: "Create Custom Field",
  description: "Create a new custom field in the HeroBot account. [See the documentation](https://my.herobot.app/api/swagger/#/Accounts/createCustomField)",
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
      type: "string",
      label: "Name",
      description: "The name of the custom field.",
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of the custom field.",
      options: [
        {
          label: "Text",
          value: "0",
        },
        {
          label: "Number",
          value: "1",
        },
        {
          label: "Date (Unix timestamp)",
          value: "2",
        },
        {
          label: "Datetime (Unix timestamp)",
          value: "3",
        },
        {
          label: "Boolean",
          value: "4",
        },
      ],
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the custom field.",
    },
  },
  async run({ $ }) {
    const response = await this.app.createCustomField({
      $,
      data: {
        name: this.name,
        type: parseInt(this.type),
        description: this.description,
      },
    });

    $.export("$summary", `Successfully created custom field ${this.name}`);
    return response;
  },
};
