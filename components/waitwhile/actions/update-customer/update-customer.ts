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
      propDefinition: [
        waitwhile,
        "tags",
      ],
    },
    locationIds: {
      propDefinition: [
        waitwhile,
        "locationIds",
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
