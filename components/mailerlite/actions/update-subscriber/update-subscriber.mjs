import mailerlite from "../../mailerlite.app.mjs";

export default {
  key: "mailerlite-update-subscriber",
  name: "Update Subscriber",
  description: "Updates single active subscriber. [See docs](https://developers.mailerlite.com/reference/update-subscriber)",
  version: "0.0.1",
  type: "action",
  props: {
    mailerlite,
    subscriber: {
      propDefinition: [
        mailerlite,
        "subscriber",
      ],
    },
    type: {
      propDefinition: [
        mailerlite,
        "type",
        () => ({
          type: "update",
        }),
      ],
    },
    fields: {
      propDefinition: [
        mailerlite,
        "fields",
      ],
      reloadProps: true,
      withLabel: true,
    },
  },
  async additionalProps() {
    const props = {};
    for (const field of this.fields) {
      props[field.value] = {
        type: "string",
        label: field.label,
        description: `${field.label} value`,
      };
    }
    return props;
  },
  async run({ $ }) {
    const fields = {};
    for (const field of this.fields) {
      fields[field.value] = this[field.value];
    }
    const data = {
      type: this.type,
      fields,
    };
    const resp = await this.mailerlite.updateSubscriber(data, this.subscriber);
    $.export("$summary", "Successfully updated subscriber");
    return resp;
  },
};
