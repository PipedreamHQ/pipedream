import justcall from "../../justcall.app.mjs";

export default {
  key: "justcall-create-contact",
  name: "Create Contact",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Add a contact to your existing JustCall Sales Dialer campaign. [See the documentation](https://justcall.io/developer-docs/#add_contacts)",
  type: "action",
  props: {
    justcall,
    campaignId: {
      propDefinition: [
        justcall,
        "campaignId",
      ],
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "Contact's first name.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Contact's last name.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Formatted phone number of the contact with country code.",
    },
    customProps: {
      type: "object",
      label: "Custom Props",
      description: "Add values to your custom contact fields. The key of the object being the ID of the custom field. The ID can be found under the [settings](https://autodialer.justcall.io/app/?section=settings) of your Sales Dialer.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      justcall,
      campaignId,
      firstName,
      lastName,
      phone,
      customProps,
    } = this;

    const response = await justcall.createContact({
      $,
      data: {
        campaign_id: campaignId,
        first_name: firstName,
        last_name: lastName,
        phone,
        custom_props: customProps,
      },
    });

    $.export("$summary", `A new contact with Id: ${response.id} was successfully created!`);
    return response;
  },
};
