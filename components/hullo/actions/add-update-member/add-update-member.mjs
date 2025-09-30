import hullo from "../../hullo.app.mjs";

export default {
  key: "hullo-add-update-member",
  name: "Add or Update Member",
  description: "Adds a new member or updates an existing member's data in Hullo. [See the documentation](https://app.hullo.me/docs/index.html#?route=post-/endpoints/members)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    hullo,
    phoneNumber: {
      propDefinition: [
        hullo,
        "phoneNumber",
      ],
    },
    fullName: {
      type: "string",
      label: "Full Name",
      description: "The full name of the member. REQUIRED if creating a new member.",
      optional: true,
    },
    registrationDate: {
      type: "string",
      label: "Registration Date",
      description: "The date the member was registered in ISO-8601 format. Example: `2000-01-23T04:56:07.000+00:00`",
      optional: true,
    },
    groups: {
      type: "string[]",
      label: "Groups",
      description: "An array containing the names of groups this member belongs to",
      optional: true,
    },
    attributes: {
      propDefinition: [
        hullo,
        "attributes",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.attributes?.length) {
      return props;
    }
    for (const attribute of this.attributes) {
      props[attribute] = {
        type: "string",
        label: attribute,
        description: `Value for ${attribute}`,
      };
    }
    return props;
  },
  methods: {
    async formatAttributes(attributeKeys, attributeValues) {
      const attributes = await this.hullo.listAttributes();
      const formattedAttributes = {};
      for (const key of attributeKeys) {
        const { type } = attributes.find(({ name }) => name === key);
        const value = type === "NUMBER"
          ? +attributeValues[key]
          : type === "LIST"
            ? JSON.parse(attributeValues[key])
            : attributeValues[key];
        formattedAttributes[key] = [
          value,
        ];
      }
      return formattedAttributes;
    },
  },
  async run({ $ }) {
    const {
      hullo,
      formatAttributes,
      phoneNumber,
      fullName,
      registrationDate,
      groups,
      attributes,
      ...attributeValues
    } = this;

    const response = await hullo.addOrUpdateMember({
      $,
      data: {
        phoneNumber,
        fullName,
        registrationDate,
        groups,
        attributes: attributes?.length
          ? await formatAttributes(attributes, attributeValues)
          : undefined,
      },
    });
    $.export("$summary", `Successfully added or updated member with phone number ${this.phoneNumber}`);
    return response;
  },
};
