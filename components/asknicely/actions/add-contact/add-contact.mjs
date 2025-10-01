import asknicely from "../../asknicely.app.mjs";

export default {
  key: "asknicely-add-contact",
  name: "Add Contact",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Add a new contact. [See the documentation](https://demo.asknice.ly/help/apidocs/getcontact)",
  type: "action",
  props: {
    asknicely,
    name: {
      propDefinition: [
        asknicely,
        "name",
      ],
      optional: true,
    },
    email: {
      propDefinition: [
        asknicely,
        "email",
      ],
    },
    segment: {
      propDefinition: [
        asknicely,
        "segment",
      ],
      optional: true,
    },
    obeyrules: {
      type: "boolean",
      label: "Obey Rules",
      description: "Setting **true** will trigger a survey to a contact that is eligible based on the value provided for your trigger field segment and Contact Rules on the [Send](https://demo.asknice.ly/send) page.",
      optional: true,
    },
    customFields: {
      propDefinition: [
        asknicely,
        "customFields",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      asknicely,
      customFields,
      ...data
    } = this;

    const response = await asknicely.addContact({
      $,
      data: {
        contacts: [
          {
            ...data,
            ...customFields,
          },
        ],
      },
    });

    $.export("$summary", "The new contact was successfully added!");
    return response;
  },
};
