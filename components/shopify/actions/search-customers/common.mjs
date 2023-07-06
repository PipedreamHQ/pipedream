export default {
  async run({ $ }) {
    let params = {
      query: this.query,
    };

    let response = await this.shopify.getPaginatedResults(
      this.shopify.searchCustomers,
      params,
      this.max,
    );
    $.export("$summary", `Found ${response.length} customer(s)`);
    return response;
  },
};
