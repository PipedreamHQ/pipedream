import constants from "../../common/constants.mjs";
import app from "../../plivo.app.mjs";

export default {
  key: "plivo-make-call",
  name: "Make A Call",
  description: "Makes a call. [See the docs](https://www.plivo.com/docs/voice/api/call#make-a-call).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    from: {
      propDefinition: [
        app,
        "phoneNumber",
      ],
      label: "From",
      description: "The phone number to be used as the caller ID for the call. The format should be the country code followed by the number. Example: `14157654321` (for the United States).",
    },
    to: {
      propDefinition: [
        app,
        "phoneNumber",
      ],
      label: "To",
      description: "The destination to be called. The destination can be either a regular number or a SIP endpoint. A regular number should be specified with the country code followed by the number. Example: `14157654321`. If you're calling a SIP endpoint, the to field should be a valid SIP URI. Example: `sip:john1234@phone.plivo.com`",
    },
  },
  async run({ $: step }) {
    const {
      from,
      to,
    } = this;

    const response = await this.app.makeOutboundCall([
      from,
      to,
      constants.DEFAULT_ANSWER_URL,
      {
        answerMethod: "GET",
      },
    ]);

    step.export("$summary", "Successfully queued call");

    return response;
  },
};
