import fidelApi from "../../fidel_api.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "fidel_api-create-program",
  name: "Create a New Program",
  description: "Creates a new card-linked program in the Fidel API. [See the documentation](https://reference.fidel.uk/reference/create-program)",
  version: "0.0.{{ts}}",
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
    },
    iconBackground: {
      type: "string",
      label: "Icon Background",
      description: "Background color for the program icon. Accepts a HEX CSS string, like '#333333'.",
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Metadata object with custom index and properties. Object size limited to 2kb.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.fidelApi.createProgram({
      name: this.name,
      icon: this.icon,
      iconBackground: this.iconBackground,
      metadata: this.metadata,
    });

    $.export("$summary", `Successfully created program '${this.name}'`);
    return response;
  },
};
