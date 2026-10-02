import crpro from "../../crpro.app.mjs";

export default {
  key: "crpro-list-contacts",
  name: "List Contacts",
  description:
    "Searches contacts in CRPRO by name, phone, email, tag or status. [See the documentation](https://crpro.com.br/integracoes/whatsapp-com-pipedream)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    crpro,
    search: {
      type: "string",
      label: "Search",
      description: "Free-text term matched against name, phone and email, e.g. `ana` or `5511999999999`. Leave empty to return every contact.",
      optional: true,
    },
    tag: {
      propDefinition: [
        crpro,
        "tagName",
      ],
      description: "Return only contacts carrying this tag. Tags are matched by name, not by ID — e.g. `lead-quente`.",
    },
    status: {
      type: "string",
      label: "Status",
      description: "Return only contacts in this conversation state — `open` for conversations still being handled, `closed` for resolved ones. Leave empty for both.",
      options: [
        "open",
        "closed",
      ],
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of contacts to return. Accepted values are `1` through `200`; the API silently caps anything higher at `200`. Defaults to `50`.",
      default: 50,
      min: 1,
      max: 200,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      crpro,
      search,
      tag,
      status,
      limit,
    } = this;

    const response = await crpro.listContacts({
      $,
      params: {
        search,
        tag,
        status,
        limit,
      },
    });

    const total = response?.data?.length ?? 0;
    $.export("$summary", `Found ${total} contact${total === 1
      ? ""
      : "s"}`);
    return response;
  },
};
