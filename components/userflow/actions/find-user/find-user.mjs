import { ConfigurationError } from "@pipedream/platform";
import app from "../../userflow.app.mjs";

export default {
  key: "userflow-find-user",
  name: "Find User",
  description: "Finds an existing user by user ID or email, optionally filtering by group ID. [See the documentation](https://userflow.com/docs/api)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    userId: {
      optional: true,
      propDefinition: [
        app,
        "userId",
      ],
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
  },
  methods: {
    findUser({
      userId, email, ...args
    }) {
      const { app } = this;
      return userId
        ? app.getUser({
          ...args,
          userId,
        })
        : app.listUsers({
          ...args,
          params: {
            email,
          },
        });
    },
  },
  async run({ $ }) {
    const {
      findUser,
      userId,
      email,
    } = this;

    if (!userId && !email) {
      throw new ConfigurationError("You must provide either a *User ID* or an *Email*.");
    }

    const response = await findUser({
      $,
      userId,
      email,
    });

    if (response.data && !response.data.length) {
      throw new Error(`No user found with email: ${email}`);
    }

    if (response?.id) {
      $.export("$summary", `Successfully found user with ID: \`${response.id}\``);
      return response;
    }

    $.export("$summary", `Successfully found user with email: \`${email}\``);
    return response.data[0];
  },
};
