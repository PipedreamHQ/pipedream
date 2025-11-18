import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-create-touch",
  name: "Create Touch",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new touch within a group. [See the documentation](https://sendoso.docs.apiary.io/#reference/touch-management)",
  type: "action",
  props: {
    sendoso,
    groupId: {
      propDefinition: [
        sendoso,
        "groupId",
      ],
      description: "The ID of the group to create the touch in.",
    },
    name: {
      type: "string",
      label: "Touch Name",
      description: "The name of the touch.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the touch.",
      optional: true,
    },
    template: {
      propDefinition: [
        sendoso,
        "template",
      ],
      optional: true,
      description: "Template ID to use for this touch.",
    },
    customMessage: {
      type: "string",
      label: "Custom Message",
      description: "Custom message for the touch.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      groupId,
      name,
      description,
      template,
      customMessage,
    } = this;

    const data = {
      name,
    };
    if (description) data.description = description;
    if (template) data.template_id = template;
    if (customMessage) data.custom_message = customMessage;

    const response = await this.sendoso.createTouch({
      $,
      groupId,
      ...data,
    });

    $.export("$summary", `Successfully created touch: ${name}`);
    return response;
  },
};

