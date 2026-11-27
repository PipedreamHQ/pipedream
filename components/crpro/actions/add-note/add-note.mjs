import crpro from "../../crpro.app.mjs";

export default {
  key: "crpro-add-note",
  name: "Add a Note to a Contact",
  description:
    "Writes an internal note on a CRPRO contact — visible to the team, never sent to the customer. [See the documentation](https://crpro.com.br/integracoes/whatsapp-com-pipedream)",
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
    content: {
      type: "string",
      label: "Note",
      description: "The note body, e.g. `Cliente pediu retorno na segunda-feira`. Internal only — it is never delivered to the customer on WhatsApp.",
    },
  },
  async run({ $ }) {
    const {
      crpro,
      contactId,
      connectedPhone,
      content,
    } = this;

    const response = await crpro.addNote({
      $,
      contactId,
      data: {
        connected_phone: connectedPhone,
        content,
      },
    });

    $.export("$summary", "Successfully added the note");
    return response;
  },
};
