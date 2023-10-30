import common from "../common/common-item.mjs";

export default {
  type: "action",
  key: "podio-update-item",
  version: "0.0.3",
  name: "Update an Item",
  description: "Updates an item. [See the documentation](https://developers.podio.com/doc/items/update-item-22363)",
  ...common,
  methods: {
    ...common.methods,
    getIfUpdate() {
      return true;
    },
  },
  async run ({ $ }) {
    const fields = await this.getFields();
    const reminder = this.reminder ?
      {
        remind_delta: this.reminder,
      } :
      this.reminder;
    const resp = await this.app.updateItem({
      $,
      itemId: this.itemId,
      data: {
        fields,
        tags: this.tags,
        reminder,
      },
    });
    $.export("$summary", `The item has been updated. (Title:${resp.title})`);
    return resp;
  },
};
