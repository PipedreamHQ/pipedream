import yay_com from "../../app/yay_com.app.mjs";

export default {
  key: "yay_com-create-outbound-call",
  name: "Create Outbound Call",
  description: "Initiates an outbound call to a specified number. [See documentation](https://www.yay.com/voip/api-docs/calls/outbound-call/)",
  version: "0.0.1",
  type: "action",
  props: {
    yay_com,
    userUuid: {
      propDefinition: [
        yay_com,
        "sipUser",
      ],
    },
    destination: {
      propDefinition: [
        yay_com,
        "destination",
      ],
    },
    displayName: {
      propDefinition: [
        yay_com,
        "displayName",
      ],
    },
    sipUsers: {
      propDefinition: [
        yay_com,
        "sipUsers",
      ],
    },
    huntGroups: {
      propDefinition: [
        yay_com,
        "huntGroups",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.yay_com.createOutboundCall({
      $,
      userUuid: this.userUuid,
      destination: this.destination,
      displayName: this.displayName,
      sipUsers: this.sipUsers || [],
      huntGroups: this.huntGroups || [],
    });

    $.export("$summary", `Successfully initiated outbound call to ${this.destination}`);
    return response;
  },
};
