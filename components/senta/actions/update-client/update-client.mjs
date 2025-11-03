import senta from "../../senta.app.mjs";

export default {
  key: "senta-update-client",
  name: "Update Client",
  description: "Updates an existing client. [See the documentation](https://app.swaggerhub.com/apis-docs/senta/Senta/1.6#/Client/put_api_clients__clientId_)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    senta,
    clientViewId: {
      propDefinition: [
        senta,
        "clientViewId",
      ],
    },
    clientId: {
      propDefinition: [
        senta,
        "clientId",
        (c) => ({
          clientViewId: c.clientViewId,
        }),
      ],
    },
    title: {
      propDefinition: [
        senta,
        "title",
      ],
      optional: true,
    },
    clientState: {
      propDefinition: [
        senta,
        "clientState",
      ],
    },
    clientType: {
      propDefinition: [
        senta,
        "clientType",
      ],
    },
    businessArea: {
      propDefinition: [
        senta,
        "businessArea",
      ],
    },
    telephone: {
      propDefinition: [
        senta,
        "telephone",
      ],
    },
    website: {
      propDefinition: [
        senta,
        "website",
      ],
    },
  },
  async run({ $ }) {
    const { doc } = await this.senta.getClient({
      clientId: this.clientId,
      $,
    });

    const data = {
      doc: {
        title: this.title || doc.title,
        clientstate: this.clientState || doc.clientstate,
        clienttype: this.clientType || doc.clienttype,
        businessarea: this.businessArea || doc.businessarea,
        telephone: this.telephone || doc.telephone,
        web: this.website || doc.web,
      },
    };

    const response = await this.senta.updateClient({
      clientId: this.clientId,
      data,
      $,
    });

    if (response.doc._id) {
      $.export("$summary", `Successfully updated client with ID ${response.doc._id}.`);
    }

    return response;
  },
};
