import app from "../../clio.app.mjs";

export default {
  key: "clio-create-matter",
  name: "Create New Matter",
  description: "Creates a new matter in Clio. [See the documentation](https://docs.developers.clio.com/api-reference/#tag/Matters/operation/Matter#index)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    clientId: {
      propDefinition: [
        app,
        "clientId",
      ],
    },
    description: {
      propDefinition: [
        app,
        "description",
      ],
    },
    closeDate: {
      propDefinition: [
        app,
        "closeDate",
      ],
    },
    clientReference: {
      propDefinition: [
        app,
        "clientReference",
      ],
    },
  },
  methods: {
    createMatter(args = {}) {
      return this.app.post({
        path: "/matters.json",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createMatter,
      clientId,
      description,
      closeDate,
      clientReference,
    } = this;

    const response = await createMatter({
      $,
      data: {
        data: {
          client: {
            id: clientId,
          },
          description,
          close_date: closeDate,
          client_reference: clientReference,
        },
      },
    });

    $.export("$summary", `Successfully created a new matter with ID \`${response.data.id}\``);
    return response;
  },
};
