import {
  cleanObj, parseObject,
} from "../../common/utils.mjs";
import indiefunnels from "../../indiefunnels.app.mjs";

export default {
  key: "indiefunnels-update-contact",
  name: "Update Contact",
  description: "Updates a Contact specified by ID. [See the documentation](https://websitebuilder.docs.apiary.io/#reference/contacts/search-contacts/update-contact)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    indiefunnels,
    contactId: {
      propDefinition: [
        indiefunnels,
        "contactId",
      ],
      description: "The ID of the contact to update",
      withLabel: true,
      reloadProps: true,
    },
    name: {
      propDefinition: [
        indiefunnels,
        "name",
      ],
      optional: true,
    },
    email: {
      propDefinition: [
        indiefunnels,
        "email",
      ],
    },
    phone: {
      propDefinition: [
        indiefunnels,
        "phone",
      ],
      optional: true,
    },
    note: {
      propDefinition: [
        indiefunnels,
        "note",
      ],
      optional: true,
    },
    address: {
      propDefinition: [
        indiefunnels,
        "address",
      ],
      optional: true,
    },
    city: {
      propDefinition: [
        indiefunnels,
        "city",
      ],
      optional: true,
    },
    state: {
      propDefinition: [
        indiefunnels,
        "state",
      ],
      optional: true,
    },
    zip: {
      propDefinition: [
        indiefunnels,
        "zip",
      ],
      optional: true,
    },
    country: {
      propDefinition: [
        indiefunnels,
        "country",
      ],
      optional: true,
    },
    companyName: {
      propDefinition: [
        indiefunnels,
        "companyName",
      ],
      optional: true,
    },
    properties: {
      propDefinition: [
        indiefunnels,
        "properties",
      ],
      optional: true,
    },
    tags: {
      propDefinition: [
        indiefunnels,
        "tags",
      ],
      optional: true,
    },
    subscribed: {
      propDefinition: [
        indiefunnels,
        "subscribed",
      ],
      optional: true,
    },
    subscriberLists: {
      propDefinition: [
        indiefunnels,
        "subscriberLists",
      ],
      optional: true,
    },
  },
  async additionalProps(props) {
    if (this.contactId) {
      props.email.default = this.contactId.label;
    }
    return {};
  },
  async run({ $ }) {
    const {
      indiefunnels,
      contactId,
      properties,
      tags,
      subscriberLists,
      ...data
    } = this;

    const response = await indiefunnels.updateContact({
      $,
      contactId: contactId.value,
      data: cleanObj({
        properties: Object.entries(parseObject(properties) || {})?.map(([
          key,
          value,
        ]) => ({
          name: key,
          value,
        })),
        tags: parseObject(tags),
        subscriberLists: parseObject(subscriberLists),
        ...data,
      }),
    });

    $.export("$summary", `Successfully updated contact with ID: ${contactId.value}`);
    return response;
  },
};
