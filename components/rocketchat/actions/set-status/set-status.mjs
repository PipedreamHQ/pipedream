import rocketchat from "../../rocketchat.app.mjs";

export default {
  key: "rocketchat-set-status",
  name: "Set Status",
  description: "Updates the user's status using two props: status text and status type. The status type can be online, away, busy or offline.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    rocketchat,
    statusText: {
      type: "string",
      label: "Status Text",
      description: "The status text to be set for the user. Be aware of the character limit on status text.",
    },
    statusType: {
      type: "string",
      label: "Status Type",
      description: "The status type to be set for the user (online, away, busy or offline)",
      options: [
        "online",
        "away",
        "busy",
        "offline",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.rocketchat.updateUserStatus({
      statusText: this.statusText,
      statusType: this.statusType,
    });
    $.export("$summary", `Successfully updated status to ${this.statusType}`);
    return response;
  },
};
