import ringcentral from "../../ringcentral.app.mjs";

export default {
  key: "ringcentral-make-callout",
  name: "Make  CallOut",
  description: "Creates a new outbound call out session. See the API docs [here](https://developers.ringcentral.com/api-reference/Call-Control/createCallOutCallSession)",
  version: "0.4.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ringcentral,
    accountId: {
      propDefinition: [
        ringcentral,
        "accountId",
      ],
    },
    deviceId: {
      propDefinition: [
        ringcentral,
        "deviceId",
      ],
      description: "Instance id of the caller. It corresponds to the 1st leg of the CallOut call.",
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "Phone number of the called party. This number corresponds to the 2nd leg of a CallOut call. Phone number in [E.164 format](https://en.wikipedia.org/wiki/E.164#Numbering_formats). e.g. `+16502223366`. If you set a **Phone Number** then don't set an **Extension Number**.",
      optional: true,
    },
    extensionNumber: {
      type: "string",
      label: "Extension Number",
      description: "Extension number of the called party. e.g. (`103`). If you set an **Extension Number** then don't set a **Phone Number**.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      accountId,
      deviceId,
      phoneNumber,
      extensionNumber,
    } = this;

    const response =
      await this.ringcentral.makeCallOut({
        $,
        accountId,
        data: {
          from: {
            deviceId,
          },
          to: {
            phoneNumber,
            extensionNumber,
          },
        },
      });

    $.export("$summary", `CallOut successfully created with ID ${response.id}`);

    return response;
  },
};
