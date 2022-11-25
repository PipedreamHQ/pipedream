import common from "../common/common-item.mjs";

export default {
  type: "action",
  key: "podio-update-item",
  version: "0.0.1",
  name: "Update an Item",
  description: "Updates an item. [See the docs](https://developers.podio.com/doc/items/update-item-22363)",
  ...common,
  props: {
    ...common.props,
    itemId: {
      propDefinition: [
        common.props.app,
        "itemId",
        (configuredProps) => ({
          appId: configuredProps.appId,
        }),
      ],
    },
  },
  async run ({ $ }) {
    const fields = this.getFields();
    const reminder = this.reminder ?
      {
        remind_delta: this.reminder,
      } :
      this.reminder;
    const resp = await this.app.updateItem({
      $,
      appId: this.appId,
      data: {
        fields,
        tags: this.tags,
        reminder,
      },
    });
    $.export("$summary", `The item has been updated. (ID:${resp.item_id}, Title:${resp.title})`);
    return resp;
  },
};
