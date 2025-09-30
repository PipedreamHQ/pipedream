import { ConfigurationError } from "@pipedream/platform";
import {
  SEND_METHOD_OPTIONS,
  STATUS_OPTIONS,
} from "../../common/constants.mjs";
import offorte from "../../offorte.app.mjs";

export default {
  key: "offorte-send-proposal",
  name: "Send Proposal",
  description: "Send a proposal in Offorte. [See the documentation](https://www.offorte.com/api-docs/api#tag/Proposals/operation/sendProposal)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    offorte,
    status: {
      type: "string",
      label: "Status",
      description: "The status of the proposal",
      options: STATUS_OPTIONS,
    },
    proposalId: {
      propDefinition: [
        offorte,
        "proposalId",
        ({ status }) => ({
          status,
        }),
      ],
    },
    passwordReset: {
      type: "boolean",
      label: "Password Reset",
      description: "Reset the existing passwords when proposal was send before",
      optional: true,
    },
    sendMethod: {
      type: "string",
      label: "Send Method",
      description: "Choose if you want to send it through Offorte or send the proposal your self",
      optional: true,
      options: SEND_METHOD_OPTIONS,
    },
    sendMessage: {
      type: "string",
      label: "Send Message",
      description: "The actual message you want to send in plain text",
      optional: true,
    },
    sendMessageId: {
      propDefinition: [
        offorte,
        "emailTemplateId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.sendMessageId && !this.sendMessage) {
      throw new ConfigurationError("Either `Send Message Id` or `Send Message` must be provided");
    }

    const response = await this.offorte.sendProposal({
      $,
      proposalId: this.proposalId,
      data: {
        password_reset: this.passwordReset,
        send_method: this.sendMethod,
        send_message: this.sendMessage,
        send_message_id: this.sendMessageId,
      },
    });

    $.export("$summary", `Successfully sent proposal with ID: ${this.proposalId}`);
    return response;
  },
};
