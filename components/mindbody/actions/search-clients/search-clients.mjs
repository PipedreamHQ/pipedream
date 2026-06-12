import app from "../../mindbody.app.mjs";

export default {
  key: "mindbody-search-clients",
  name: "Search Clients",
  description:
    "Searches for client (member) records by name, email address, or phone number."
    + " Returns client IDs, contact details, and membership status."
    + " Use this to find a client's ID before calling **Get Client Details**, **Get Appointments**, or **Book Appointment**."
    + " The `searchText` matches against first name, last name, email, and phone — partial matches are supported."
    + " [See the documentation](https://developers.mindbodyonline.com/PublicDocumentation/V6#tag/Client/operation/ClientService_GetClients)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    searchText: {
      type: "string",
      label: "Search Text",
      description: "Text to search for. Matches against first name, last name, email, and phone. Example: `Jerry Seinfeld` or `jerry@example.com`.",
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
    offset: {
      propDefinition: [
        app,
        "offset",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.searchClients({
      $,
      params: {
        SearchText: this.searchText,
        Limit: this.limit,
        Offset: this.offset,
      },
    });
    const clients = response.Clients || [];
    $.export("$summary", `Found ${clients.length} client${clients.length === 1
      ? ""
      : "s"} matching "${this.searchText}"`);
    return response;
  },
};
