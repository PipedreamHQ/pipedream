export default {
  PartnerNetworkConnectionId: {
    type: "string",
    label: "Partner Network Connection ID",
    description: "The ID of a connection between Salesforce organizations.",
    async options() {
      const items = await this.salesforce.listSObjectTypeIds("PartnerNetworkConnection");
      return items?.map((item) => ({
        label: item.ConnectionName,
        value: item.Id,
      }));
    },
  },
  UserId: {
    type: "string",
    label: "User ID",
    description: "The ID of a user in your organization.",
    async options() {
      const items = await this.salesforce.listSObjectTypeIds("User");
      return items?.map((item) => ({
        label: item.Name,
        value: item.Id,
      }));
    },
  },
};
