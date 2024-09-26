import regal from "../../regal.app.mjs";

export default {
  key: "regal-add-contact-to-event",
  name: "Add Contact to Event",
  description: "Add a contact to an event. [See the documentation](https://developer.regal.io/reference/api)",
  version: "0.0.1",
  type: "action",
  props: {
    regal,
    userId: {
      propDefinition: [
        regal,
        "userId",
      ],
      optional: false,
    },
    phone: {
      propDefinition: [
        regal,
        "phone",
      ],
    },
    email: {
      propDefinition: [
        regal,
        "email",
      ],
    },
    name: {
      propDefinition: [
        regal,
        "name",
      ],
    },
    customPropertyName1: {
      type: "string",
      label: "Custom Property Name (1)",
      description: "Name of a custom property to add to the event",
      optional: true,
    },
    customPropertyValue1: {
      type: "string",
      label: "Custom Property Value (1)",
      description: "Value of a custom property to add to the event",
      optional: true,
    },
    additionalProperties: {
      type: "integer",
      label: "Additional Properties to Add",
      description: "The number of additional properties to add to the event",
      optional: true,
      reloadProps: true,
    },
  },
  additionalProps() {
    const props = {};
    if (!this.additionalProperties > 0) {
      return props;
    }
    for (let i = 2; i < this.additionalProperties + 2; i++) {
      props[`customPropertyName${i}`] = {
        type: "string",
        label: `Custom Property Name (${i})`,
        description: "Name of a custom property to add to the event",
      };
      props[`customPropertyValue${i}`] = {
        type: "string",
        label: `Custom Property Value (${i})`,
        description: "Value of a custom property to add to the event",
      };
    }
    return props;
  },
  async run({ $ }) {
    const properties = this.customPropertyName1
      ? {
        [this.customPropertyName1]: this.customPropertyValue,
      }
      : {};
    for (let i = 2; i < this.additionalProperties + 2; i++) {
      properties[this[`customPropertyName${i}`]] = this[`customPropertyValue${i}`];
    }

    const response = await this.regal.customEvent({
      $,
      data: {
        userId: this.userId,
        traits: {
          phones: this.phone
            ? {
              [this.phone]: {},
            }
            : undefined,
          emails: this.email
            ? {
              [this.email]: {},
            }
            : undefined,
        },
        name: this.name,
        properties,
      },
    });
    if (response?.message === "ok") {
      $.export("$summary", `Successfully added contact with ID "${this.userId}" to event`);
    }
    return response;
  },
};
