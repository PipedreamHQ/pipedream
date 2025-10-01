import app from "../../_46elks.app.mjs";

export default {
  key: "_46elks-make-phone-call",
  name: "Make Phone Call",
  description: "Dials and connects two phone numbers using the 46elks service. [See the documentation](https://46elks.com/docs/make-call)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    from: {
      label: "From Phone Number",
      description: "The phone number initiating the call. A valid phone number in [E.164 format](https://46elks.com/kb/e164). Can be one of your voice enabled 46elks numbers, the phone number you signed up with, or an unlocked number.",
      propDefinition: [
        app,
        "number",
      ],
    },
    to: {
      label: "To Phone Number",
      description: "The phone number receiving the call. The phone number of the recipient, in [E.164 format](https://46elks.com/kb/e164).",
      propDefinition: [
        app,
        "number",
      ],
    },
    voiceStart: {
      description: "A webhook URL that returns the first action to execute. See [Call actions](https://46elks.com/docs/call-actions) for details. It is also possible to add a JSON struct for direct call actions without any logic, like: `{\"connect\":\"+46700000000\"}`.",
      propDefinition: [
        app,
        "webhookUrl",
      ],
    },
    timeout: {
      type: "integer",
      label: "Timeout",
      description: "Seconds to wait for the to-number to pickup before stopping call. Eg. `60`",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      from,
      to,
      voiceStart,
      timeout,
    } = this;

    const response = await app.makeCall({
      $,
      data: {
        from,
        to,
        voice_start: voiceStart,
        ...(timeout && {
          timeout,
        }),
      },
    });

    $.export("$summary", `Successfully made call with ID \`${response.id}\``);
    return response;
  },
};
