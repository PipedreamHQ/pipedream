import { pickFields } from "../../common/utils.mjs";
import openphone from "../../openphone.app.mjs";

export default {
  key: "openphone-list-contacts",
  name: "List Contacts",
  description: "Retrieve a paginated list of contacts. Optionally filter by external IDs and/or sources. All contacts for the organization are returned only when neither `externalIds` nor `sources` is provided. Example: call with no filters → returns up to 10 contacts for the organization. Use `fields` to return only specific fields per contact. [See the documentation](https://www.openphone.com/docs/api-reference/contacts/list-contacts)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    openphone,
    externalIds: {
      propDefinition: [
        openphone,
        "externalIds",
      ],
    },
    sources: {
      propDefinition: [
        openphone,
        "sources",
      ],
    },
    maxResults: {
      propDefinition: [
        openphone,
        "contactMaxResults",
      ],
    },
    pageToken: {
      propDefinition: [
        openphone,
        "pageToken",
      ],
    },
    fields: {
      propDefinition: [
        openphone,
        "fields",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.openphone.listContacts({
      $,
      params: {
        externalIds: this.externalIds,
        sources: this.sources,
        maxResults: this.maxResults,
        pageToken: this.pageToken,
      },
    });
    const contacts = response?.data ?? [];
    $.export("$summary", `Retrieved ${contacts.length} contact${contacts.length === 1
      ? ""
      : "s"}`);
    return {
      ...response,
      data: pickFields(contacts, this.fields),
    };
  },
};
