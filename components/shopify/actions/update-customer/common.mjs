export default {
  async run({ $ }) {
    const metafields = await this.createMetafieldsArray(this.metafields, this.customerId, "customer");

    const customer = {
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
      metafields,
    };
    const response = (await this.shopify.updateCustomer(this.customerId, customer)).result;
    $.export("$summary", `Updated customer \`${response.email || response.first_name}\` with id \`${response.id}\``);
    return response;
  },
};
