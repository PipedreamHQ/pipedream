import app from "../../permit_io.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "permit_io-create-tenant",
  name: "Create Tenant",
  description: "Mints a new isolated silo (such as a Customer Account or Organization) to manage multi-tenant permissions. [See the documentation](https://api.permit.io/v2/redoc#tag/Tenants/operation/create_tenant)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    projId: {
      propDefinition: [
        app,
        "projId",
      ],
    },
    envId: {
      propDefinition: [
        app,
        "envId",
        ({ projId }) => ({
          projId,
        }),
      ],
    },
    key: {
      type: "string",
      label: "Key",
      description: "A unique URL-friendly identifier for the tenant (alphanumeric, hyphens, underscores only, e.g. `stripe-inc`).",
    },
    name: {
      type: "string",
      label: "Name",
      description: "A descriptive display name for the tenant (e.g. `Stripe Inc`)",
    },
    description: {
      type: "string",
      label: "Description",
      description: "An optional longer description of the tenant",
      optional: true,
    },
    attributes: {
      type: "object",
      label: "Attributes",
      description: "Arbitrary JSON attributes used to enforce attribute-based access control (ABAC) policies (e.g. `{ \"allowed_locations\": [\"US\", \"CA\"] }`)",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      projId,
      envId,
      key,
      name,
      description,
      attributes,
    } = this;

    const response = await this.app.createTenant({
      $,
      projId,
      envId,
      data: {
        key,
        name,
        description,
        ...(attributes && {
          attributes: utils.parseObject(attributes),
        }),
      },
    });

    $.export("$summary", `Created tenant **${name}** (key: ${key})`);
    return response;
  },
};
