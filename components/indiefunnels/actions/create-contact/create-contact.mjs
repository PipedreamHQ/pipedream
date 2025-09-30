import { parseObject } from "../../common/utils.mjs";
import indiefunnels from "../../indiefunnels.app.mjs";

export default {
  key: "indiefunnels-create-contact",
  name: "Create Contact",
  description: "Creates a new Contact on your IndieFunnel website. [See the documentation](https://websitebuilder.docs.apiary.io/#reference/contacts/list-and-create/create-new-contact)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    indiefunnels,
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
  async run({ $ }) {
    const {
      indiefunnels,
      properties,
      tags,
      subscriberLists,
      ...data
    } = this;

    const response = await indiefunnels.createContact({
      $,
      data: {
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
      },
    });

    $.export("$summary", `Successfully created contact with ID: ${response.id}`);
    return response;
  },
};
