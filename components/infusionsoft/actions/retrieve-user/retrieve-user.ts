import infusionsoft from "../../app/infusionsoft.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Retrieve User",
  description:
    "Retrieve a single user by ID from Keap CRM. [See the documentation](https://developer.infusionsoft.com/docs/restv2/#tag/Users/operation/getUserById)",
  key: "infusionsoft-retrieve-user",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    infusionsoft,
    userId: {
      propDefinition: [
        infusionsoft,
        "userId",
      ],
    },
  },
  async run({ $ }): Promise<object> {
    const result = await this.infusionsoft.retrieveUser({
      $,
      userId: String(this.userId ?? ""),
    });

    $.export("$summary", `Successfully retrieved user ${this.userId}`);

    return result;
  },
});
