import gocanvas from "../../gocanvas.app.mjs";

export default {
  key: "gocanvas-delete-dispatch",
  name: "Delete Dispatch",
  description: "Removes a specific dispatch from GoCanvas. [See the documentation](https://help.gocanvas.com/hc/en-us/article_attachments/26468076609559)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    gocanvas,
    form: {
      propDefinition: [
        gocanvas,
        "form",
      ],
    },
    dispatchId: {
      propDefinition: [
        gocanvas,
        "dispatchId",
        (c) => ({
          form: c.form,
        }),
      ],
    },
  },
  async run({ $ }) {
    const description = await this.gocanvas.getDispatchDescription({
      $,
      dispatchId: this.dispatchId,
    });
    const response = await this.gocanvas.dispatchItems({
      $,
      data: `
        <?xml version="1.0" encoding="utf-8"?>
          <List>
            <DI FormName="${this.form}" Action="Delete" OriginalDescription="${description}">
              <DIEntry Label="Date" Value="${Date.now()}"/>
            </DI>
          </List>
      `,
    });
    $.export("$summary", `Successfully deleted dispatch with ID ${this.dispatchId}`);
    return response;
  },
};
