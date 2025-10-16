import app from "../../campaignhq.app.mjs";

export default {
  name: "Create List",
  description: "Create List [See the documentation](https://campaignhq.docs.apiary.io/#reference/0/lists-collection/create-a-new-list).",
  key: "campaignhq-create-list",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "Name of the list",
    },
  },
  async run({ $ }) {
    const res = await this.app.createList({
      name: this.name,
    });
    $.export("summary", `List successfully created with id "${res.id}".`);
    return res;
  },
};
