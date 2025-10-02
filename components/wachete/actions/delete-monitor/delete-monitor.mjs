import wachete from "../../wachete.app.mjs";

export default {
  key: "wachete-delete-monitor",
  name: "Delete Monitor",
  description: "Removes an existing monitor for a specific website or web page. [See the documentation(https://api.wachete.com/swagger/ui/index/index.html)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    wachete,
    folderId: {
      propDefinition: [
        wachete,
        "folderId",
      ],
    },
    wachetId: {
      propDefinition: [
        wachete,
        "wachetId",
        (c) => ({
          parentId: c.folderId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.wachete.deleteMonitor({
      $,
      id: this.wachetId,
    });
    $.export("$summary", `Successfully deleted Wachet with ID ${this.wachetId}`);
    return response;
  },
};
