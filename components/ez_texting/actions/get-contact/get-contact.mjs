import app from "../../ez_texting.app.mjs";

export default {
  key: "ez_texting-get-contact",
  name: "Get Contact",
  description: "Get a contact by phone number, or `null` if the number is not in the contact book. The returned `optOut` flag is the authoritative opt-out state — EZ Texting emits no opt-out webhook, so an opt-out made outside a reply (at the carrier, or in the EZ Texting UI) is only visible here. [See the documentation](https://developers.eztexting.com/reference/get-1)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    phoneNumber: {
      propDefinition: [
        app,
        "phoneNumber",
      ],
      description: "The phone number of the contact to retrieve, e.g. `5551234567`.",
    },
  },
  async run({ $ }) {
    let response;

    try {
      response = await this.app.getContact({
        $,
        phoneNumber: this.phoneNumber,
      });
    } catch (error) {
      // A number that has never been messaged has no contact record, which is
      // the ordinary case when using this action as a pre-send opt-out check.
      // Returning `null` lets the workflow treat it as "no opt-out on record"
      // rather than failing the run.
      if (error?.response?.status !== 404) {
        throw error;
      }

      $.export("$summary", `No contact found for ${this.phoneNumber}`);
      return null;
    }

    $.export("$summary", `Retrieved contact ${this.phoneNumber} (opted out: ${response?.optOut === true
      ? "yes"
      : "no"})`);

    return response;
  },
};
