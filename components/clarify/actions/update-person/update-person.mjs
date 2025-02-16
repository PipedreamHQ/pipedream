import app from "../../clarify.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "clarify-update-person",
  name: "Update Person",
  description: "Updates an existing person record in the Clarify system. [See the documentation](https://api.getclarify.ai/swagger#/default/updateRecord).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    workspace: {
      propDefinition: [
        app,
        "workspace",
      ],
    },
    personId: {
      propDefinition: [
        app,
        "personId",
        ({ workspace }) => ({
          workspace,
        }),
      ],
    },
    companyId: {
      propDefinition: [
        app,
        "companyId",
        ({ workspace }) => ({
          workspace,
        }),
      ],
    },
  },
  methods: {
    updatePerson({
      workspace, personId, ...args
    }) {
      return this.app.patch({
        path: `/workspaces/${workspace}/objects/${constants.OBJECT_ENTITY.PERSON}/records/${personId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      updatePerson,
      workspace,
      personId,
      companyId,
    } = this;

    const response = await updatePerson({
      $,
      workspace,
      personId,
      data: {
        data: {
          type: "object",
          attributes: {
            companyId,
          },
        },
      },
    });

    $.export("$summary", "Successfully updated person.");
    return response;
  },
};
