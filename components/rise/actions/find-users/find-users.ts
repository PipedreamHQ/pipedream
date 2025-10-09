import { defineAction } from "@pipedream/types";
import rise from "../../app/rise.app";

export default defineAction({
  name: "Find Users",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "rise-find-users",
  description: "Find a list of users. [See docs here](https://help.rise.com/en/articles/4177145-users-api)",
  type: "action",
  props: {
    rise,
    email: {
      label: "Email",
      description: "The email of user to find",
      type: "string",
    },
  },
  async run({ $ }) {
    const response = await this.rise.getUsers({
      $,
      params: {
        email: this.email,
      },
    });

    if (response.users) {
      $.export("$summary", "Successfully found users");
    }

    return response.users;
  },
});
