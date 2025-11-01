import common from "../common.mjs";

export default {
  ...common,
  name: "Get Users",
  key: "twitch-get-users",
  description: "Gets the user objects for the specified Twitch login names",
  version: "0.1.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    login: {
      type: "string[]",
      label: "Login names",
      description: "User login name. Multiple login names can be specified. Limit: 100.",
    },
  },
  async run() {
    const params = {
      login: this.login,
    };
    return (await this.twitch.getMultipleUsers(params)).data.data;
  },
};
