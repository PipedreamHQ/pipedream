import waitwhile from "../../app/waitwhile.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Create Customer",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "waitwhile-create-customer",
  description: "Create a customer. [See the doc here](https://developers.waitwhile.com/reference/postcustomers)",
  props: {
    waitwhile,
    name: {
      propDefinition: [
        waitwhile,
        "name",
      ],
    },
    firstName: {
      propDefinition: [
        waitwhile,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        waitwhile,
        "lastName",
      ],
    },
    phone: {
      propDefinition: [
        waitwhile,
        "phone",
      ],
    },
    email: {
      propDefinition: [
        waitwhile,
        "email",
      ],
    },
    tags: {
      type: "string[]",
      description: "Optional tags associated with customer",
      propDefinition: [
        waitwhile,
        "tag",
      ],
    },
    locationIds: {
      label: "Location IDs",
      type: "string[]",
      description: "Identifier of customer, automatically derived from visitor contact information if not provided.",
      propDefinition: [
        waitwhile,
        "locationId",
      ],
    },
    addTag: {
      propDefinition: [
        waitwhile,
        "addTag",
      ],
    },
    removeTag: {
      propDefinition: [
        waitwhile,
        "removeTag",
      ],
    },
    externalId: {
      propDefinition: [
        waitwhile,
        "externalId",
      ],
    },
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    const params = {
      name: this.name,
      firstName: this.firstName,
      lastName: this.lastName,
      phone: this.phone,
      email: this.email,
      tags: this.tags,
      locationIds: this.locationIds,
      addTag: this.addTag,
      removeTag: this.removeTag,
      externalId: this.externalId,
    };

    try {
      const data = await this.waitwhile.createCustomers(params);
      $.export("summary", `Successfully created a customer with ID: ${data.id}`);

      return data;
    } catch (error) {
      const statusCode = error[Object.getOwnPropertySymbols(error)[1]].status;
      const statusText = error[Object.getOwnPropertySymbols(error)[1]].statusText;
      throw new Error(`Error status code: ${statusCode}. Error status response: ${statusText}`);
    }
  },
});
