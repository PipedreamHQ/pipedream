import cinc from "../../cinc.app.mjs";

export default {
  key: "cinc-create-lead",
  name: "Create New Lead",
  description: "This component creates a new lead in Cinc. [See the documentation](https://public.cincapi.com/v2/docs/#post-site-leads)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    cinc,
    firstName: {
      propDefinition: [
        cinc,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        cinc,
        "lastName",
      ],
    },
    email: {
      propDefinition: [
        cinc,
        "email",
      ],
    },
    cellphone: {
      propDefinition: [
        cinc,
        "cellphone",
      ],
    },
    status: {
      propDefinition: [
        cinc,
        "status",
      ],
    },
    source: {
      propDefinition: [
        cinc,
        "source",
      ],
    },
    medianListingPrice: {
      propDefinition: [
        cinc,
        "medianListingPrice",
      ],
    },
    averageListingPrice: {
      propDefinition: [
        cinc,
        "averageListingPrice",
      ],
    },
    isBuyerLead: {
      propDefinition: [
        cinc,
        "isBuyerLead",
      ],
    },
    isSellerLead: {
      propDefinition: [
        cinc,
        "isSellerLead",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.cinc.createLead({
      $,
      data: {
        info: {
          contact: {
            first_name: this.firstName,
            last_name: this.lastName,
            email: this.email,
            phone_numbers: {
              cell_phone: this.cellphone,
            },
          },
          status: this.status,
          source: this.source,
          buyer: this.medianListingPrice || this.averageListingPrice
            ? {
              median_price: this.medianListingPrice && +this.medianListingPrice,
              average_price: this.averageListingPrice && +this.averageListingPrice,
            }
            : undefined,
          is_buyer: this.isBuyerLead,
          is_seller: this.isSellerLead,
        },
      },
    });
    $.export("$summary", `New lead added with ID: ${response.id}`);
    return response;
  },
};
