import zendeskSell from "../../zendesk_sell.app.mjs";

export default {
  key: "zendesk_sell-create-contact",
  name: "Create Contact",
  description: "Creates a new contact. [See the documentation](https://developer.zendesk.com/api-reference/sales-crm/resources/contacts/#create-a-contact).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    zendeskSell,
    isOrganization: {
      propDefinition: [
        zendeskSell,
        "isOrganization",
      ],
      reloadProps: true,
    },
    status: {
      propDefinition: [
        zendeskSell,
        "status",
      ],
    },
    title: {
      propDefinition: [
        zendeskSell,
        "title",
      ],
    },
    description: {
      propDefinition: [
        zendeskSell,
        "description",
      ],
    },
    email: {
      propDefinition: [
        zendeskSell,
        "email",
      ],
    },
    phone: {
      propDefinition: [
        zendeskSell,
        "phone",
      ],
    },
  },
  async additionalProps() {
    const props = {};
    if (this.isOrganization) {
      props.name = {
        type: "string",
        label: "Name",
        description: "Name of the contact",
      };
    } else {
      props.firstName = {
        type: "string",
        label: "First Name",
        description: "First name of the contact",
      };
      props.lastName = {
        type: "string",
        label: "Last Name",
        description: "Last name of the contact",
      };
    }
    return props;
  },
  async run({ $ }) {
    const response = await this.zendeskSell.createContact({
      $,
      data: {
        data: {
          is_organization: this.isOrganization,
          name: this.name,
          first_name: this.firstName,
          last_name: this.lastName,
          customer_status: this.status,
          title: this.title,
          description: this.description,
          email: this.email,
          phone: this.phone,
        },
      },
    });
    $.export("$summary", `Successfully created contact with ID ${response.data.id}`);
    return response;
  },
};
