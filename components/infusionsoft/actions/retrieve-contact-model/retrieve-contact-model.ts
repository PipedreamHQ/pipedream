import infusionsoft from "../../app/infusionsoft.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Retrieve Contact Model",
  description:
    "Retrieve the custom fields model for contacts to discover available custom field IDs and types. [See the documentation](https://developer.infusionsoft.com/docs/restv2/#tag/Contact)",
  key: "infusionsoft-retrieve-contact-model",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    infusionsoft,
  },
  async run({ $ }): Promise<object> {
    const result = await this.infusionsoft.retrieveContactModel({
      $,
    });

    $.export("$summary", "Successfully retrieved contact model");

    return result;
  },
});
