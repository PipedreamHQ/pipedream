import { defineAction } from "@pipedream/types";
import namely from "../../app/namely.app";

export default defineAction({
  key: "namely-get-user",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  name: "Get User",
  description: "Get a user. [See docs here](https://developers.namely.com/docs/namely-api/1c7f311bfa8e8-get-a-profile)",
  type: "action",
  props: {
    namely,
    userId: {
      propDefinition: [
        namely,
        "userId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.namely.getUser({
      $,
      userId: this.userId,
    });

    $.export("$summary", `Successfully retrieved user with id ${response.profiles[0].id}`);

    return response;
  },
});
