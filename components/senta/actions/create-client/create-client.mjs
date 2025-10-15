import senta from "../../senta.app.mjs";

export default {
  key: "senta-create-client",
  name: "Create Client",
  description: "Creates a new client. [See the documentation](https://app.swaggerhub.com/apis-docs/senta/Senta/1.6#/Client/post_api_clients)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    senta,
    title: {
      propDefinition: [
        senta,
        "title",
      ],
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
    email: {
      propDefinition: [
        senta,
        "email",
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
    const data = {
      title: this.title,
      clientstate: this.clientState,
      clienttype: this.clientType,
      businessarea: this.businessArea,
      contacts: this.email
        ? [
          {
            email: this.email,
          },
        ]
        : [],
      telephone: this.telephone,
      web: this.website,
    };

    const response = await this.senta.createClient({
      data,
      $,
    });

    if (response.doc._id) {
      $.export("$summary", `Successfully created client with ID ${response.doc._id}.`);
    }

    return response;
  },
};
