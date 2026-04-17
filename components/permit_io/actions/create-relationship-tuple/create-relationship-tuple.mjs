import app from "../../permit_io.app.mjs";

export default {
  key: "permit_io-create-relationship-tuple",
  name: "Create Relationship Tuple",
  description: "Defines a granular relationship between two resources, enabling advanced Relationship-Based Access Control (ReBAC). [See the documentation](https://api.permit.io/v2/redoc#tag/Relationship-tuples/operation/create_relationship_tuple)",
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
    subject: {
      type: "string",
      label: "Subject",
      description: "The resource instance assigned to the new relation. Use the format `resource_type:instance_key` (e.g. `organization:permitio`).",
    },
    relation: {
      type: "string",
      label: "Relation",
      description: "The relation to assign between the subject and object (e.g. `owner`, `member`)",
    },
    object: {
      type: "string",
      label: "Object",
      description: "The resource instance on which the relation is assigned. Use the format `resource_type:instance_key` (e.g. `repo:opal`).",
    },
    tenant: {
      propDefinition: [
        app,
        "tenant",
        ({
          projId, envId,
        }) => ({
          projId,
          envId,
        }),
      ],
      description: "The tenant the subject and object belong to. Required if the resource instances don't exist yet so they can be created implicitly.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      projId,
      envId,
      subject,
      relation,
      object,
      tenant,
    } = this;

    const response = await this.app.createRelationshipTuple({
      $,
      projId,
      envId,
      data: {
        subject,
        relation,
        object,
        tenant,
      },
    });

    $.export("$summary", `Created relationship: **${subject}** → ${relation} → **${object}**`);
    return response;
  },
};
