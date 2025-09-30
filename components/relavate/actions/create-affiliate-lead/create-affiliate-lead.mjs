import relavate from "../../relavate.app.mjs";

export default {
  key: "relavate-create-affiliate-lead",
  name: "Create Affiliate Lead",
  description: "This component enables you to create a new affiliate lead for marketing. [See the documentation](https://api.relavate.co/#2a307851-9d54-42ea-9f54-3fb600b152a5)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    relavate,
    campaignId: {
      propDefinition: [
        relavate,
        "campaignId",
      ],
      reloadProps: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the lead being created",
      options: [
        "Pending",
        "Won",
      ],
    },
    client: {
      type: "string",
      label: "Client",
      description: "The company or name of the client",
    },
  },
  async additionalProps() {
    const props = {};
    const partnerType = this.relavate.getPartnerType();
    if (partnerType === "partner") {
      props.vendorId = {
        type: "string",
        label: "Vendor ID",
        description: "The ID of the vendor",
        options: async () => await this.getVendorIdPropOptions(),
      };
    }
    if (partnerType === "vendor") {
      props.partnerId = {
        type: "string",
        label: "Partner ID",
        description: "The ID of the partner",
        options: async () => await this.getPartnerIdPropOptions(),
      };
    }
    return props;
  },
  methods: {
    async getVendorIdPropOptions() {
      const vendors = await this.relavate.listVendors();
      const vendorIds = vendors?.map(({ vendorID }) => vendorID );
      const options = [];
      for (const vendorId of vendorIds) {
        const { name } = await this.relavate.getVendor({
          vendorId,
        });
        options.push({
          value: vendorId,
          label: name,
        });
      }
      return options;
    },
    async getPartnerIdPropOptions() {
      const partners = await this.relavate.listPartners();
      const partnerIds = partners?.map(({ partnerID }) => partnerID );
      const options = [];
      for (const partnerId of partnerIds) {
        const { name } = await this.relavate.getPartner({
          partnerId,
        });
        options.push({
          value: partnerId,
          label: name,
        });
      }
      return options;
    },
  },
  async run({ $ }) {
    const response = await this.relavate.createAffiliateLead({
      $,
      params: {
        campaignID: this.campaignId,
        client: this.client,
        status: this.status,
        vendorID: this.vendorId,
        partnerID: this.partnerId,
      },
    });
    $.export("$summary", `Created affiliate lead with ID: ${response.id}`);
    return response;
  },
};
