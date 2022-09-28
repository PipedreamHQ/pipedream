import waitwhile from "../../app/waitwhile.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Update Customer",
  version: "0.0.1",
  key: "waitwhile-update-customer",
  description: "",
  props: {
    waitwhile,
    customerId: {
      propDefinition: [
        "customerId",
        (c) => ({
          prevContext: c.prevContext,
        }),
      ],
    },
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
      type: "string[]",
      propDefinition: [
        waitwhile,
        "locationId",
        (c) => ({
          prevContext: c.prevContext,
        }),
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

    };

    const data = await this.waitwhile.updateCustomer(params);
    $.export("summary", "Successfully updated a customer");
    return data;
  },
});
