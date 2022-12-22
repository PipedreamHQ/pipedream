import teamgate from "../../teamgate.app.mjs";

export default {
  key: "teamgate-update-cart-products-status",
  name: "Update Cart Products Status",
  version: "0.0.1",
  description: "This endpoint is meant for setting all products in cart active or inactive, which is same as in-stock or out-of-stock. `isActive`: true, means product is in-stock. `isActive`: false, mean product is out of stock. [See the docs here](https://developers.teamgate.com/#75b14b70-375e-45bf-9b63-ed183592c8bb)",
  type: "action",
  props: {
    teamgate,
    deals: {
      propDefinition: [
        teamgate,
        "deals",
      ],
    },
    isActive: {
      propDefinition: [
        teamgate,
        "isActive",
      ],
    },
  },
  async run({ $ }) {
    const {
      deals, isActive,
    } = this;

    const response = await this.teamgate.updateCart({
      $,
      data: {
        isActive,
      },
      dealId: deals,
    });

    $.export("$summary", "Products Successfuly updated");
    return response;
  },
};
