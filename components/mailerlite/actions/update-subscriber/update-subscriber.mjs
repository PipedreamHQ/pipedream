import mailerlite from "../../mailerlite.app.mjs";

export default {
  key: "mailerlite-update-subscriber",
  name: "Update Subscriber",
  description: "Updates single active subscriber. [See the documentation](https://developers.mailerlite.com/docs/subscribers.html#create-update-subscriber)",
  version: "0.0.4",
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
    if (!this.fields?.length) {
      return props;
    }
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
    if (this.fields?.length) {
      for (const field of this.fields) {
        fields[field.value] = this[field.value];
      }
    }
    const data = {
      status: this.type,
      fields,
    };
    const resp = await this.mailerlite.updateSubscriber({
      $,
      subscriber: this.subscriber,
      data,
    });
    $.export("$summary", "Successfully updated subscriber");
    return resp;
  },
};
