import waitwhile from "../../app/waitwhile.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Update Customer",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "waitwhile-update-customer",
  description: "Update a customer. [See the doc here](https://developers.waitwhile.com/reference/postcustomerscustomerid)",
  props: {
    waitwhile,
    customerId: {
      propDefinition: [
        waitwhile,
        "customerId",
      ],
    },
    name: {
      optional: true,
      propDefinition: [
        waitwhile,
        "name",
      ],
    },
    firstName: {
      optional: true,
      propDefinition: [
        waitwhile,
        "firstName",
      ],
    },
    lastName: {
      optional: true,
      propDefinition: [
        waitwhile,
        "lastName",
      ],
    },
    phone: {
      optional: true,
      propDefinition: [
        waitwhile,
        "phone",
      ],
    },
    notes: {
      optional: true,
      propDefinition: [
        waitwhile,
        "customerNoteId",
        (c) => ({
          customerId: c.customerId,
        }),
      ],
    },
    email: {
      optional: true,
      propDefinition: [
        waitwhile,
        "email",
      ],
    },
    tags: {
      optional: true,
      type: "string[]",
      description: "Optional tags associated with customer",
      propDefinition: [
        waitwhile,
        "tag",
      ],
    },
    locationIds: {
      type: "string[]",
      propDefinition: [
        waitwhile,
        "locationId",
      ],
    },
    addTag: {
      optional: true,
      propDefinition: [
        waitwhile,
        "addTag",
      ],
    },
    removeTag: {
      optional: true,
      propDefinition: [
        waitwhile,
        "removeTag",
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
      notes: this.notes,
      locationIds: this.locationIds,
      addTag: this.addTag,
      removeTag: this.removeTag,
      customerId: this.customerId,
    };

    try {
      const data = await this.waitwhile.updateCustomer(params);
      $.export("summary", "Successfully updated a customer");
      return data;
    } catch (error) {
      const statusCode = error[Object.getOwnPropertySymbols(error)[1]].status;
      const statusText = error[Object.getOwnPropertySymbols(error)[1]].statusText;
      throw new Error(`Error status code: ${statusCode}. Error status response: ${statusText}`);
    }

  },
});
