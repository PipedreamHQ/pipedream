import app from "../../piggy.app.mjs";
import constants from "../common/constants.mjs";

export default {
  name: "Create Contact Attribute",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "piggy-create-contact-attribute",
  description: "Creates a contact attribute. [See the documentation](https://docs.piggy.eu/v3/oauth/contact-attributes#:~:text=Create%20Contact%20Attribute)",
  type: "action",
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "Name of the attribute",
    },
    dataType: {
      type: "string",
      label: "Data type",
      description: "Type of the attribute",
      options: constants.DATA_TYPES,
    },
    label: {
      type: "string",
      label: "Label",
      description: "Label of the attribute",
    },
    descripion: {
      type: "string",
      label: "Descripion",
      description: "Description of the attribute",
    },
  },
  async run({ $ }) {
    const response = await this.app.createContactAttribute({
      $,
      data: {
        name: this.name,
        data_type: this.dataType,
        label: this.label,
        description: this.description,
      },
    });

    if (response) {
      $.export("$summary", `Successfully created contact attribute with name ${response.data.name}`);
    }

    return response;
  },
};
