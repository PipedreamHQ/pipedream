import postgrid from "../../postgrid.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "postgrid-create-postcard",
  name: "Create Postcard",
  description: "Creates a new postcard in PostGrid. [See the documentation](https://docs.postgrid.com/#fe8c4cd6-7617-4023-9437-669fa847ccc1)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    postgrid,
    to: {
      propDefinition: [
        postgrid,
        "contactId",
      ],
      label: "To",
      description: "The id or contact object of the receiver.",
    },
    from: {
      propDefinition: [
        postgrid,
        "contactId",
      ],
      label: "From",
      description: "The id or contact object of the sender.",
    },
    frontHTML: {
      type: "string",
      label: "Front HTML",
      description: "The HTML content for the front of the postcard.",
    },
    backHTML: {
      type: "string",
      label: "Back HTML",
      description: "The HTML content for the back of the postcard.",
    },
    size: {
      type: "string",
      label: "Size",
      description: "The size of the postcard. Must be one of either 6x4, 9x6 or 11x6.",
      options: constants.POSTCARD_SIZE,
    },
    sendDate: {
      type: "string",
      label: "Send Date",
      description: "The desired date for the letter to be sent out. Example: `2023-02-16T15:40:35.873Z`",
      optional: true,
    },
    express: {
      type: "boolean",
      label: "Express",
      description: "Express shipping.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description for the postcard.",
      optional: true,
    },
    mailingClass: {
      type: "string",
      label: "Mailing Class",
      description: "Mailing class. Defaults to first_class.",
      options: constants.MAILING_CLASS,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      postgrid,
      ...data
    } = this;

    const response = await postgrid.createPostcard({
      data,
      $,
    });

    if (response.id) {
      $.export("$summary", `Successfully created postcard with ID ${response.id}.`);
    }

    return response;
  },
};
