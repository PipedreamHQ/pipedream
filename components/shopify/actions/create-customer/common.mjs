export default {
  props: {
    sendEmailInvite: {
      type: "boolean",
      label: "Send Email Invite",
      description: "Send email invite to address",
      optional: true,
    },
  },
  async run({ $ }) {
    let data = {
      first_name: this.firstName,
      last_name: this.lastName,
      email: this.email,
      phone: this.phone,
      addresses: [
        {
          address1: this.address,
          company: this.company,
          city: this.city,
          province: this.province,
          country: this.country,
          zip: this.zip,
        },
      ],
      send_email_invite: this.sendEmailInvite,
    };

    let response = (await this.shopify.createCustomer(data)).result;
    $.export("$summary", `Created new customer \`${this.email}\` with id \`${response.id}\``);
    return response;
  },
};
