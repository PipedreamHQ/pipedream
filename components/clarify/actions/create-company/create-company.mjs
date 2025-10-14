import app from "../../clarify.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "clarify-create-company",
  name: "Create Company",
  description: "Creates a new company record in the Clarify system. [See the documentation](https://api.getclarify.ai/swagger#/default/createRecord).",
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
    name: {
      propDefinition: [
        app,
        "companyName",
      ],
    },
    domain: {
      propDefinition: [
        app,
        "companyDomain",
      ],
    },
  },
  methods: {
    createCompany({
      workspace, ...args
    } = {}) {
      return this.app.post({
        path: `/workspaces/${workspace}/objects/${constants.OBJECT_ENTITY.COMPANY}/records`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createCompany,
      workspace,
      name,
      domain,
    } = this;

    const response = await createCompany({
      $,
      workspace,
      data: {
        data: {
          type: "object",
          attributes: {
            name,
            domains: {
              items: [
                domain,
              ],
            },
          },
        },
      },
    });

    $.export("$summary", "Successfully created company.");
    return response;
  },
};
