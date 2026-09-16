import arlo from "../../arlo.app.mjs";

export default {
  key: "arlo-get-registration",
  name: "Get Registration",
  description: "Retrieve full registration plus attendee/contact detail for a single registration by its ID. Run **List Registrations** first to find a valid `registrationId`. Example: call with `registrationId: \"3\"` to get that registration's `Status`, `CreatedDateTime`, and attendee `Contact` (name, email). [See the documentation](https://developer.arlo.co/doc/api/2012-02-01/auth/resources/registrations#instance-httpget).",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    arlo,
    registrationId: {
      propDefinition: [
        arlo,
        "registrationId",
      ],
    },
  },
  async run({ $ }) {
    const rawRegistration = await this.arlo.getRegistration({
      $,
      registrationId: this.registrationId,
    });
    const registration = this.arlo._unwrapItem(rawRegistration, "Registration");
    const contact = this.arlo._findLinkedItem(registration, "Contact");
    const contactName = contact
      ? `${contact.FirstName ?? ""} ${contact.LastName ?? ""}`.trim()
      : null;
    $.export("$summary", `Retrieved registration ${this.registrationId}${contactName
      ? ` for ${contactName}`
      : ""}`);
    return registration;
  },
};
