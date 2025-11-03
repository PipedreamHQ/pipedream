import { defineAction } from "@pipedream/types";
import rise from "../../app/rise.app";

export default defineAction({
  name: "Find Invitations",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "rise-find-invitations",
  description: "Find a list of invitations. [See docs here](https://help.rise.com/en/articles/4177042-invitations-api)",
  type: "action",
  props: {
    rise,
    email: {
      label: "Email",
      description: "The email of user to find invitations",
      type: "string",
    },
  },
  async run({ $ }) {
    const response = await this.rise.getInvitations({
      $,
      params: {
        email: this.email,
      },
    });

    if (response.invitations) {
      $.export("$summary", "Successfully found invitations");
    }

    return response.invitations;
  },
});
