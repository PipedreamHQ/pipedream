import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-get-sequence-enrollment",
  name: "Get Sequence Enrollment",
  description: "Retrieve a contact's sequence enrollment status. [See the documentation](https://developers.hubspot.com/docs/api/crm/sequences)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    hubspot,
    contactId: {
      propDefinition: [
        hubspot,
        "objectId",
        () => ({
          objectType: "contact",
        }),
      ],
      label: "Contact ID",
      description: "The ID of the contact whose sequence enrollment status will be retrieved. Example: `1234567890`.",
    },
  },
  async run({ $ }) {
    const response = await this.hubspot.getSequenceEnrollment({
      $,
      contactId: this.contactId,
    });

    $.export("$summary", response?.id
      ? `Contact ${this.contactId} is enrolled in sequence ${response.sequenceId}`
      : `Retrieved sequence enrollment status for contact ${this.contactId}`);
    return response;
  },
};
