import app from "../../content_snare.app.mjs";

export default {
  key: "content_snare-create-client",
  name: "Create Client",
  description: "Creates a new client on Content Snare. [See the documentation](https://api.contentsnare.com/partner_api/v1/documentation#post-/partner_api/v1/clients)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    companyName: {
      propDefinition: [
        app,
        "companyName",
      ],
    },
    email: {
      propDefinition: [
        app,
        "clientEmail",
      ],
    },
    fullName: {
      propDefinition: [
        app,
        "clientFullName",
      ],
    },
    phone: {
      propDefinition: [
        app,
        "clientPhone",
      ],
    },
  },
  methods: {
    createClient(args = {}) {
      return this.app.post({
        path: "/clients",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createClient,
      companyName,
      email,
      fullName,
      phone,
    } = this;

    const response = await createClient({
      $,
      data: {
        client_companies: (companyName && [
          {
            name: companyName,
          },
        ]),
        email,
        full_name: fullName,
        phone,
      },
    });

    $.export("$summary", `Successfully created client with ID \`${response.id}\``);
    return response;
  },
};
