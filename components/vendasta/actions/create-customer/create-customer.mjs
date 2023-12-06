import vendasta from "../../vendasta.app.mjs";

export default {
  key: "vendasta-create-customer",
  name: "Create Customer",
  description: "Creates a new customer in Vendasta. [See the documentation](https://developers.vendasta.com/platform/aeb620fbc73a2-create-customer)",
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
    email: {
      propDefinition: [
        vendasta,
        "email",
      ],
    },
    phoneNumber: {
      propDefinition: [
        vendasta,
        "phoneNumber",
      ],
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
    const response = await this.vendasta.createCustomer({
      $,
      data: {
        type: "customers",
        attributes: {
          emailAddresses: [
            this.email,
          ],
          phoneNumbers: [
            this.phoneNumber,
          ],
          givenName: this.givenName,
          familyName: this.familyName,
          tags: this.tags,
          permissionToContact: this.permissionToContact,
        },
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
      $.export("$summary", `Successfully created customer with ID ${response.id}`);
    }

    return response;
  },
};
