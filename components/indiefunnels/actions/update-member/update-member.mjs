import { cleanObj } from "../../common/utils.mjs";
import indiefunnels from "../../indiefunnels.app.mjs";

export default {
  key: "indiefunnels-update-member",
  name: "Update Member",
  description: "Updates a Member specified by ID. [See the documentation](https://websitebuilder.docs.apiary.io/#reference/members/single-member/update-member)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    indiefunnels,
    memberId: {
      propDefinition: [
        indiefunnels,
        "memberId",
      ],
    },
    name: {
      propDefinition: [
        indiefunnels,
        "name",
      ],
      description: "The name of the member",
      optional: true,
    },
    groups: {
      propDefinition: [
        indiefunnels,
        "groups",
      ],
      optional: true,
    },
    approved: {
      propDefinition: [
        indiefunnels,
        "approved",
      ],
      optional: true,
    },
    contactId: {
      propDefinition: [
        indiefunnels,
        "contactId",
      ],
      optional: true,
    },
    billingPhone: {
      propDefinition: [
        indiefunnels,
        "billingPhone",
      ],
      optional: true,
    },
    billingCompanyName: {
      propDefinition: [
        indiefunnels,
        "billingCompanyName",
      ],
      optional: true,
    },
    billingCompanyId: {
      propDefinition: [
        indiefunnels,
        "billingCompanyId",
      ],
      optional: true,
    },
    billingCountry: {
      propDefinition: [
        indiefunnels,
        "billingCountry",
      ],
      optional: true,
    },
    billingState: {
      propDefinition: [
        indiefunnels,
        "billingState",
      ],
      optional: true,
    },
    billingCity: {
      propDefinition: [
        indiefunnels,
        "billingCity",
      ],
      optional: true,
    },
    billingZipCode: {
      propDefinition: [
        indiefunnels,
        "billingZipCode",
      ],
      optional: true,
    },
    billingAddress: {
      propDefinition: [
        indiefunnels,
        "billingAddress",
      ],
      optional: true,
    },
    billingAddress2: {
      propDefinition: [
        indiefunnels,
        "billingAddress2",
      ],
      optional: true,
    },
    shippingPhone: {
      propDefinition: [
        indiefunnels,
        "shippingPhone",
      ],
      optional: true,
    },
    shippingCompanyName: {
      propDefinition: [
        indiefunnels,
        "shippingCompanyName",
      ],
      optional: true,
    },
    shippingCompanyId: {
      propDefinition: [
        indiefunnels,
        "shippingCompanyId",
      ],
      optional: true,
    },
    shippingCountry: {
      propDefinition: [
        indiefunnels,
        "shippingCountry",
      ],
      optional: true,
    },
    shippingState: {
      propDefinition: [
        indiefunnels,
        "shippingState",
      ],
      optional: true,
    },
    shippingCity: {
      propDefinition: [
        indiefunnels,
        "shippingCity",
      ],
      optional: true,
    },
    shippingZipCode: {
      propDefinition: [
        indiefunnels,
        "shippingZipCode",
      ],
      optional: true,
    },
    shippingAddress: {
      propDefinition: [
        indiefunnels,
        "shippingAddress",
      ],
      optional: true,
    },
    shippingAddress2: {
      propDefinition: [
        indiefunnels,
        "shippingAddress2",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.indiefunnels.updateMember({
      $,
      memberId: this.memberId,
      data: cleanObj({
        name: this.name,
        groups: this.groups,
        approved: this.approved,
        contactId: this.contactId,
        billingAddress: {
          phone: this.billingPhone,
          companyName: this.billingCompanyName,
          companyId: this.billingCompanyId,
          country: this.billingCountry,
          state: this.billingState,
          city: this.billingCity,
          zipCode: this.billingZipCode,
          address: this.billingAddress,
          address2: this.billingAddress2,
        },
        shippingAddress: {
          phone: this.shippingPhone,
          companyName: this.shippingCompanyName,
          companyId: this.shippingCompanyId,
          country: this.shippingCountry,
          state: this.shippingState,
          city: this.shippingCity,
          zipCode: this.shippingZipCode,
          address: this.shippingAddress,
          address2: this.shippingAddress2,
        },
      }),
    });

    $.export("$summary", `Successfully updated member with ID: ${this.memberId}`);
    return response;
  },
};
