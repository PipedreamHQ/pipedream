import mautic from "../../mautic.app.mjs";

export default {
  key: "mautic-list-available-contact-fields",
  name: "List Available Contact Fields",
  description: "Gets a list of available contact fields including custom ones. [See docs](https://developer.mautic.org/#list-available-fields)",
  version: "0.2.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    mautic,
  },
  async run({ $ }) {
    const response = await this.mautic.listContactsFields({
      $,
    });
    $.export("$summary", "Successfully retrieved contacts fields");
    return response;
  },
};
