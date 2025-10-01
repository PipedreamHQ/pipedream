import { parseObject } from "../../common/utils.mjs";
import fidelApi from "../../fidel_api.app.mjs";

export default {
  key: "fidel_api-create-program",
  name: "Create Program",
  description: "Creates a new card-linked program in the Fidel API. [See the documentation](https://reference.fidel.uk/reference/create-program)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    fidelApi,
    name: {
      type: "string",
      label: "Program Name",
      description: "The name of the Program. Must be between 4 and 50 characters.",
    },
    icon: {
      type: "string",
      label: "Icon",
      description: "Emoji to associate with the Program. Uses the `:emoji-name:` format. Must be between 4 and 200 characters.",
      optional: true,
    },
    iconBackground: {
      type: "string",
      label: "Icon Background",
      description: "Background color for the program icon. Accepts a HEX CSS string, like '#333333'.",
      optional: true,
    },
    metadata: {
      propDefinition: [
        fidelApi,
        "metadata",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.fidelApi.createProgram({
      data: {
        name: this.name,
        icon: this.icon,
        iconBackground: this.iconBackground,
        metadata: parseObject(this.metadata),
      },
    });

    $.export("$summary", `Successfully created program with ID: ${response.items[0]?.id}`);
    return response;
  },
};
