import crpro from "../../crpro.app.mjs";

export default {
  key: "crpro-add-tags",
  name: "Apply Tags to a Contact",
  description:
    "Applies one or more tags to a CRPRO contact, which is what segments campaigns and automations. [See the documentation](https://crpro.com.br/integracoes/whatsapp-com-pipedream)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    crpro,
    contactId: {
      propDefinition: [
        crpro,
        "contactId",
      ],
      optional: false,
    },
    connectedPhone: {
      propDefinition: [
        crpro,
        "connectedPhone",
      ],
    },
    tags: {
      propDefinition: [
        crpro,
        "tags",
      ],
    },
  },
  async run({ $ }) {
    const {
      crpro,
      contactId,
      connectedPhone,
      tags,
    } = this;

    const response = await crpro.addTags({
      $,
      contactId,
      data: {
        connected_phone: connectedPhone,
        tags,
      },
    });

    $.export("$summary", `Successfully applied ${tags.length} tag${tags.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
