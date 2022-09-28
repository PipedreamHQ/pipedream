import waitwhile from "../../app/waitwhile.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Create Customer",
  version: "0.0.1",
  key: "waitwhile-create-customer",
  description: "Create a customer",
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


    const data = await this.waitwhile.createCustomers(params);
    $.export("summary", "Successfully created a customer");
    return data;

  },
});
