import { ConfigurationError } from "@pipedream/platform";
import yayCom from "../../yay_com.app.mjs";

export default {
  key: "yay_com-create-outbound-call",
  name: "Create Outbound Call",
  description: "Initiates an outbound call to a specified number. [See the documentation](https://www.yay.com/voip/api-docs/calls/outbound-call/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    yayCom,
    userUuid: {
      propDefinition: [
        yayCom,
        "sipUser",
      ],
    },
    destination: {
      propDefinition: [
        yayCom,
        "destination",
      ],
    },
    displayName: {
      propDefinition: [
        yayCom,
        "displayName",
      ],
    },
    sipUsers: {
      propDefinition: [
        yayCom,
        "sipUser",
      ],
      label: "Target SIP Users",
      type: "string[]",
      description: "One or more SIP users who will receive the outbound call request",
      optional: true,
    },
    huntGroups: {
      propDefinition: [
        yayCom,
        "huntGroups",
      ],
    },
  },
  async run({ $ }) {
    // Combine sipUsers and huntGroups into the targets array
    const targets = [
      ...(this.sipUsers?.map((uuid) => ({
        type: "sipuser",
        uuid,
      })) || []),
      ...(this.huntGroups?.map((uuid) => ({
        type: "huntgroup",
        uuid,
      })) || []),
    ];

    if (!targets.length) {
      throw new ConfigurationError("Please provide at least one target (SIP user or hunt group)");
    }

    const response = await this.yayCom.createOutboundCall({
      $,
      data: {
        user_uuid: this.userUuid,
        destination: this.destination,
        display_name: this.displayName,
        targets,
      },
    });

    $.export("$summary", `Successfully initiated outbound call to ${this.destination}`);
    return response;
  },
};
