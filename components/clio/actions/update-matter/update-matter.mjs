import app from "../../clio.app.mjs";

export default {
  key: "clio-update-matter",
  name: "Update Matter",
  description: "Updates an existing matter in Clio. [See the documentation](https://docs.developers.clio.com/api-reference/#tag/Matters/operation/Matter#update)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    matterId: {
      propDefinition: [
        app,
        "matterId",
      ],
    },
    clientId: {
      optional: true,
      propDefinition: [
        app,
        "clientId",
      ],
    },
    description: {
      optional: true,
      propDefinition: [
        app,
        "description",
      ],
    },
    closeDate: {
      optional: true,
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
    updateMatter({
      matterId, ...args
    } = {}) {
      return this.app.patch({
        path: `/matters/${matterId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      updateMatter,
      matterId,
      clientId,
      description,
      closeDate,
      clientReference,
    } = this;

    const response = await updateMatter({
      $,
      matterId,
      data: {
        data: {
          ...(clientId && {
            client: {
              id: clientId,
            },
          }),
          description,
          close_date: closeDate,
          client_reference: clientReference,
        },
      },
    });

    $.export("$summary", `Successfully updated matter with ID \`${response.data.id}\``);
    return response;
  },
};
