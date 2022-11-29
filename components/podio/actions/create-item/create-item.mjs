import common from "../common/common-item.mjs";

const props = common.props;
delete props.itemId;

export default {
  type: "action",
  key: "podio-create-item",
  version: "0.0.1",
  name: "Create an Item",
  description: "Adds a new item to the given app. [See the docs](https://developers.podio.com/doc/items/add-new-item-22362)",
  ...common,
  props,
  async run ({ $ }) {
    const fields = this.getFields();
    const reminder = this.reminder ?
      {
        remind_delta: this.reminder,
      } :
      this.reminder;
    const resp = await this.app.createItem({
      $,
      appId: this.appId,
      data: {
        fields,
        tags: this.tags,
        reminder,
      },
    });
    $.export("$summary", `The item has been created. (ID:${resp.item_id}, Title:${resp.title})`);
    return resp;
  },
};
