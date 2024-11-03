import gocanvas from "../../gocanvas.app.mjs";

export default {
  key: "gocanvas-delete-dispatch",
  name: "Delete Dispatch",
  description: "Removes a specific dispatch from GoCanvas. [See the documentation](https://help.gocanvas.com/hc/en-us/article_attachments/26468076609559)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    gocanvas,
    dispatchId: {
      propDefinition: [
        gocanvas,
        "dispatchId",
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
            <DI FormName="Daily Report" Action="Delete" OriginalDescription="${description}">
              <DIEntry />
              <DIListItems>
                <DIListItem>
                  <DIEntries>
                    <DIEntry Label="Date" Value="${Date.now()}"/>
                  </DIEntries>
                </DIListItem>
              </DIListItems>
            </DI>
          </List>
      `,
    });
    $.export("$summary", `Successfully deleted dispatch with ID ${this.dispatchId}`);
    return response;
  },
};
