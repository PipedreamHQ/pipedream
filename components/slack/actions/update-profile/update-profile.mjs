import slack from "../../slack.app.mjs";

export default {
  key: "slack-update-profile",
  name: "Update Profile",
  description: "Update basic profile field such as name or title",
  version: "0.0.2",
  type: "action",
  props: {
    slack,
    name: {
      propDefinition: [
        slack,
        "name",
      ],
    },
    value: {
      propDefinition: [
        slack,
        "value",
      ],
    },
  },
  async run() {
    return await this.slack.sdk().users.profile.set({
      name: this.name,
      value: this.value,
    });
  },
};
