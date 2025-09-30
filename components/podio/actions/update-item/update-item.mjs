import common from "../common/common-item.mjs";

export default {
  type: "action",
  key: "podio-update-item",
  version: "0.0.5",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Update an Item",
  description: "Updates an item. [See the documentation](https://developers.podio.com/doc/items/update-item-22363)",
  ...common,
  methods: {
    ...common.methods,
    getIfUpdate() {
      return true;
    },
    async getFileIds($, newFileIds = []) {
      const { files } = await this.app.getItem({
        itemId: this.itemId,
        $,
      });
      const fileIds = files?.map(({ file_id: id }) => id) || [];
      return [
        ...fileIds,
        ...newFileIds,
      ];
    },
  },
  async run ({ $ }) {
    const fields = await this.getFields();
    const reminder = this.reminder ?
      {
        remind_delta: this.reminder,
      } :
      this.reminder;
    const fileIds = await this.getFileIds($, this.fileIds);
    const resp = await this.app.updateItem({
      $,
      itemId: this.itemId,
      data: {
        fields,
        tags: this.tags,
        reminder,
        file_ids: fileIds,
      },
    });
    $.export("$summary", `Successfully updated item with ID ${this.itemId}.`);
    return resp;
  },
};
