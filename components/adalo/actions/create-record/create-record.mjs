import base from "../common/base.mjs";

export default {
  ...base,
  key: "adalo-create-record",
  name: "Create Record",
  description: "Create a new record. [See docs here](https://help.adalo.com/integrations/the-adalo-api/collections)",
  version: "0.0.1",
  type: "action",
  props: {
    ...base.props,
    data: {
      label: "Data",
      description: "The data to create record. E.g. `{ \"Email\": \"string\", \"Username\": \"string\", \"Full Name\": \"string\" }`",
      type: "string",
    },
  },
  async run({ $ }) {
    const response = await this.adalo.createRecord({
      $,
      collectionId: this.collectionId,
      data: JSON.parse(this.data),
    });

    $.export("$summary", `Successfully created record with id ${response.id}`);

    return response;
  },
};
