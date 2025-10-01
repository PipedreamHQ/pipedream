import { ConfigurationError } from "@pipedream/platform";
import { parseArray } from "../../common/utils.mjs";
import modeck from "../../modeck.app.mjs";

export default {
  key: "modeck-create-render",
  name: "Create Render",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new edit with the data supplied. [See the documentation](https://modeck.io/docs#modeckapi)",
  type: "action",
  props: {
    modeck,
    deck: {
      propDefinition: [
        modeck,
        "deck",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of this edit.",
    },
    editId: {
      type: "string",
      label: "Edit Id",
      description: "The identifier of this edit.",
      optional: true,
    },
    notificationEmail: {
      type: "string",
      label: "Notification Email",
      description: "The email that will be notified on render finishing.",
      optional: true,
    },
    mogrtSeq: {
      type: "string[]",
      label: "MogrtSeq",
      description: "An array of mogrtSeq objects.",
    },
  },
  async run({ $ }) {
    const {
      modeck,
      mogrtSeq,
      ...data
    } = this;

    const response = await modeck.createRender({
      $,
      data: {
        ...data,
        mogrtSeq: parseArray(mogrtSeq),
      },
    });

    if (!response.success) throw new ConfigurationError(response.info);

    $.export("$summary", `A new edit with Id: ${response.editId} was successfully created!`);
    return response;
  },
};

