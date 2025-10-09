import app from "../../bitport.app.mjs";

export default {
  key: "bitport-add-item",
  name: "Add Item",
  description: "Add new torrent. [See the documentation](https://bitport.io/api/index.html?url=/v2/transfers&method=POST)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    torrent: {
      type: "string",
      label: "Torrent",
      description: "A URL linking to a .torrent file or a magnet link",
    },
    folderCode: {
      propDefinition: [
        app,
        "folderCode",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.addItem({
      $,
      data: {
        torrent: this.torrent,
        folder_code: this.folderCode,
      },
    });

    $.export("$summary", "Successfully added torrent!");
    return response;
  },
};
