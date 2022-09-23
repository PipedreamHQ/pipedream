import waitwhile from "../../app/waitwhile.app";
import { defineAction } from "@pipedream/types";
import {
  formatArrayStrings, formatString,
} from "../../common/utils";
import constants from "../../common/constants";

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
    const {
      tags,
      addTag,
      removeTag,
    } = this;

    interface Params {
      [key: string]: any;
    }

    const updatedTags = formatArrayStrings(tags, constants.TAGS, "tags");
    const updatedAddTag = formatString(addTag, constants.TAGS);
    const updatedRemoveTag = formatString(removeTag, constants.TAGS);

    const params: Params = {
      name: this.name,
      firstName: this.firstName,
      lastName: this.lastName,
      phone: this.phone,
      email: this.email,
      locationIds: this.locationIds,
      externalId: this.externalId,
    };

    updatedTags?.length && (params.tags = updatedTags);
    updatedAddTag && (params.addTag = updatedAddTag);
    updatedRemoveTag && (params.removeTag = updatedRemoveTag);

    const data = await this.waitwhile.createCustomers(params);
    $.export("summary", "Successfully created a customer");
    return data;

  },
});
