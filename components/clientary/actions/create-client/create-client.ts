import { defineAction } from "@pipedream/types";
import app from "../../app/clientary.app";

export default defineAction({
  key: "clientary-create-client",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Create Client",
  description: "Creates a new client. [See docs here](https://www.clientary.com/api/clients)",
  type: "action",
  props: {
    app,
    name: {
      type: "string",
      label: "Client Name",
      description: "Client name",
    },
    number: {
      type: "string",
      label: "Number",
      description: "Client number. Must be unique, e.g. `101`",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Client description",
      optional: true,
    },
    website: {
      type: "string",
      label: "Web Site",
      description: "Client Web Site",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "The country where the client is registered",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "The state where the client is registered",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The city where the client is registered",
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "The address where the client is registered",
      optional: true,
    },
    zip: {
      type: "string",
      label: "Zip",
      description: "The zip code where the client is registered",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.getRequestMethod("createClient")({
      $,
      data: {
        name: this.name,
        number: this.number,
        description: this.description,
        website: this.website,
        country: this.country,
        state: this.state,
        city: this.city,
        address: this.address,
        zip: this.zip,
      },
    });
    $.export("$summary", `Successfully created a client (ID: ${response.id})`);
    return response;
  },
});
