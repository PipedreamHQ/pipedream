import zendeskSell from "../../zendesk_sell.app.mjs";

export default {
  key: "zendesk_sell-create-lead",
  name: "Create Lead",
  description: "Creates a new lead. [See the documentation](https://developer.zendesk.com/api-reference/sales-crm/resources/leads/#create-a-lead).",
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
      description: "Indicator of whether or not this lead refers to an organization or an individual",
      reloadProps: true,
    },
    status: {
      propDefinition: [
        zendeskSell,
        "status",
      ],
      description: "The status of the lead",
    },
    title: {
      propDefinition: [
        zendeskSell,
        "title",
      ],
      description: "The lead’s job title",
    },
    description: {
      propDefinition: [
        zendeskSell,
        "description",
      ],
      description: "The lead’s description",
    },
    email: {
      propDefinition: [
        zendeskSell,
        "email",
      ],
      description: "The lead’s email address",
    },
    phone: {
      propDefinition: [
        zendeskSell,
        "phone",
      ],
      description: "The lead’s phone number",
    },
  },
  async additionalProps() {
    const props = {};
    if (this.isOrganization) {
      props.name = {
        type: "string",
        label: "Name",
        description: "Name of the lead",
      };
    } else {
      props.firstName = {
        type: "string",
        label: "First Name",
        description: "First name of the lead",
      };
      props.lastName = {
        type: "string",
        label: "Last Name",
        description: "Last name of the lead",
      };
    }
    return props;
  },
  async run({ $ }) {
    const response = await this.zendeskSell.createLead({
      $,
      data: {
        data: {
          first_name: this.firstName,
          last_name: this.lastName,
          organization_name: this.name,
          status: this.status,
          title: this.title,
          description: this.description,
          email: this.email,
          phone: this.phone,
        },
      },
    });
    $.export("$summary", `Successfully created lead with ID ${response.data.id}`);
    return response;
  },
};
