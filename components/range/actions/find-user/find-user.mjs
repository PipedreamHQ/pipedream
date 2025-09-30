import app from "../../range.app.mjs";

export default {
  key: "range-find-user",
  name: "Find User",
  description: "Finds a user by email address. [See the docs](https://www.range.co/docs/api#rpc-find-user).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the user to find.",
    },
  },
  methods: {
    findUser(args = {}) {
      return this.app.makeRequest({
        path: "/users/find",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const { email } = this;

    const {
      user_id,
      user,
    }  = await this.findUser({
      step,
      params: {
        email,
        include_refs: true,
        allow_pending: true,
      },
    });

    step.export("$summary", `Successfully found user with ID ${user_id}`);

    if (user) {
      return {
        user_id,
        user,
      };
    }

    return {
      user_id,
    };
  },
};
