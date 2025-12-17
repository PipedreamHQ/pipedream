import gocanvas from "../../gocanvas.app.mjs";

export default {
  key: "gocanvas-create-dispatch",
  name: "Create Dispatch",
  description: "Creates a dispatch item in GoCanvas. [See the documentation](https://help.gocanvas.com/hc/en-us/article_attachments/26468076609559)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
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
      description: "The name of the form you want to create a prepopulated submission for",
    },
    entries: {
      type: "object",
      label: "Entries",
      description: `DIEntry elements consisting of label/value pairs.
      \n Label: Either the Export Label or plain Label field attribute (caseinsensitive) as defined in the form builder.
      \n Value: The value assigned to this Dispatch Item entry.
      `,
    },
  },
  async run({ $ }) {
    let entriesString = "";
    for (const [
      key,
      value,
    ] of Object.entries(this.entries)) {
      entriesString += `<DIEntry Label="${key}" Value="${value}"/>`;
    }
    const response = await this.gocanvas.dispatchItems({
      $,
      data: `
        <?xml version="1.0" encoding="utf-8"?>
          <List>
            <DI FormName="${this.form}">
              ${entriesString}
            </DI>
          </List>
      `,
    });
    $.export("$summary", `Successfully created dispatch item in ${this.form}`);
    return response;
  },
};
