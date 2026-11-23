import app from "../../tinko.app.mjs";

export default {
  key: "tinko-find-contact",
  name: "Find Contact",
  description: "Search contacts by name, phone number, tag or blocked status. Returns the newest contacts first."
    + " Tinko stores phone numbers formatted, for example `+55 11 99999 9999`, so search for a group of digits."
    + " Use the returned `id` with **Update Contact**, **Add Tag to Contact** or **Add Note to Contact**."
    + " [See the documentation](https://docs.tinko.com.br/endpoints/contacts/#listar-contatos)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    name: {
      type: "string",
      label: "Name Contains",
      description: "Return only contacts whose name contains this value, e.g. `Nathan`.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone Contains",
      description: "Return only contacts whose phone number contains this value, e.g. `99999`.",
      optional: true,
    },
    tagId: {
      propDefinition: [
        app,
        "tagId",
      ],
      description: "Return only contacts that have this tag, e.g. `01JABCDEFGHJKMNPQRSTVWXYZ0`. Use **List Tags** to find tag IDs (the `id` field).",
      optional: true,
    },
    blocked: {
      type: "boolean",
      label: "Blocked",
      description: "Set to `true` to return only blocked contacts or `false` to return only contacts that are not blocked, e.g. `false`. Leave empty to return both.",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const contacts = await this.app.getPaginatedResults({
      fn: this.app.listContacts,
      args: {
        $,
        params: {
          name: this.name,
          phone: this.phone,
          tag: this.tagId,
          blocked: this.blocked,
        },
      },
      max: this.maxResults,
    });

    $.export("$summary", `Found ${contacts.length} contact${contacts.length === 1
      ? ""
      : "s"}`);
    return contacts;
  },
};
