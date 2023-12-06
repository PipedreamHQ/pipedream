import vendasta from "../../vendasta.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "vendasta-update-customer",
  name: "Update Customer",
  description: "Updates an existing customer in Vendasta. [See the documentation](https://developers.vendasta.com/platform/b9da8dcb1e502-update-customer)",
  version: "0.0.1",
  type: "action",
  props: {
    vendasta,
    partnerId: {
      propDefinition: [
        vendasta,
        "partnerId",
      ],
    },
    businessLocationId: {
      propDefinition: [
        vendasta,
        "businessLocationId",
        (c) => ({
          partnerId: c.partnerId,
        }),
      ],
    },
    customerId: {
      propDefinition: [
        vendasta,
        "customerId",
        (c) => ({
          businessLocationId: c.businessLocationId,
        }),
      ],
    },
    email: {
      propDefinition: [
        vendasta,
        "email",
      ],
      optional: true,
    },
    phoneNumber: {
      propDefinition: [
        vendasta,
        "phoneNumber",
      ],
      optional: true,
    },
    givenName: {
      propDefinition: [
        vendasta,
        "givenName",
      ],
    },
    familyName: {
      propDefinition: [
        vendasta,
        "familyName",
      ],
    },
    tags: {
      propDefinition: [
        vendasta,
        "tags",
      ],
    },
    permissionToContact: {
      propDefinition: [
        vendasta,
        "permissionToContact",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.vendasta.updateCustomer({
      $,
      customerId: this.customerId,
      data: {
        type: "customers",
        attributes: utils.cleanObject({
          emailAddresses: this.email
            ? [
              this.email,
            ]
            : undefined,
          phoneNumbers: this.phoneNumber
            ? [
              this.phoneNumber,
            ]
            : undefined,
          givenName: this.givenName,
          familyName: this.familyName,
          tags: this.tags,
          permissionToContact: this.permissionToContact,
        }),
        relationships: {
          businessLocation: {
            data: {
              id: this.businessLocationId,
            },
          },
        },
      },
    });

    if (response?.id) {
      $.export("$summary", `Successfully updated customer with ID ${response.id}`);
    }

    return response;
  },
};
