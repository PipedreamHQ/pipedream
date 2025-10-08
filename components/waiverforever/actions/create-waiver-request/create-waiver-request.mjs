import waiverforever from "../../waiverforever.app.mjs";

export default {
  key: "waiverforever-create-waiver-request",
  name: "Create Waiver Request",
  description: "Create waiver request. [See the docs here](https://docs.waiverforever.com/?javascript--nodejs#create-waiver-request)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    waiverforever,
    name: {
      propDefinition: [
        waiverforever,
        "name",
      ],
    },
    size: {
      propDefinition: [
        waiverforever,
        "size",
      ],
    },
    note: {
      propDefinition: [
        waiverforever,
        "note",
      ],
    },
    type: {
      propDefinition: [
        waiverforever,
        "type",
      ],
    },
    contactInfo: {
      propDefinition: [
        waiverforever,
        "contactInfo",
      ],
    },
    template: {
      propDefinition: [
        waiverforever,
        "template",
      ],
    },
  },
  async run({ $ }) {
    const {
      name,
      size,
      note,
      type,
      contactInfo,
      template,
    } = this;

    const templateResponse = await this.waiverforever.createWaiverRequest({
      name,
      size,
      note,
      type,
      contact_info: contactInfo,
      template_id: template,
    });

    $.export("$summary", `Waiver Request successfully created "${templateResponse.data?.id}"`);
    return templateResponse;
  },
};
