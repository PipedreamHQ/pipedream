import { parseObject } from "../../common/utils.mjs";
import hex from "../../hex.app.mjs";

export default {
  key: "hex-create-data-connection",
  name: "Create Data Connection",
  description: "Create a data connection. [See the documentation](https://learn.hex.tech/docs/api/api-reference#operation/CreateDataConnection)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    hex,
    sharingWorkspacePublic: {
      propDefinition: [
        hex,
        "sharingWorkspacePublic",
      ],
    },
    sharingWorkspaceGuests: {
      propDefinition: [
        hex,
        "sharingWorkspaceGuests",
      ],
    },
    sharingWorkspaceMembers: {
      propDefinition: [
        hex,
        "sharingWorkspaceMembers",
      ],
    },
    groups: {
      propDefinition: [
        hex,
        "groups",
      ],
    },
    schemaRefreshAccess: {
      propDefinition: [
        hex,
        "schemaRefreshAccess",
      ],
    },
    schemaRefreshSchedule: {
      propDefinition: [
        hex,
        "schemaRefreshSchedule",
      ],
    },
    schemaFilters: {
      propDefinition: [
        hex,
        "schemaFilters",
      ],
    },
    allowWritebackCells: {
      propDefinition: [
        hex,
        "allowWritebackCells",
      ],
    },
    includeMagic: {
      propDefinition: [
        hex,
        "includeMagic",
      ],
    },
    connectViaSsh: {
      propDefinition: [
        hex,
        "connectViaSsh",
      ],
    },
    description: {
      propDefinition: [
        hex,
        "description",
      ],
    },
    connectionDetails: {
      propDefinition: [
        hex,
        "connectionDetails",
      ],
    },
    type: {
      propDefinition: [
        hex,
        "type",
      ],
    },
    name: {
      propDefinition: [
        hex,
        "name",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.hex.createDataConnection({
      $,
      data: {
        sharing: {
          workspace: {
            public: this.sharingWorkspacePublic,
            guests: this.sharingWorkspaceGuests,
            members: this.sharingWorkspaceMembers,
          },
        },
        schemaRefreshAccess: this.schemaRefreshAccess,
        schemaRefreshSchedule:
        this.schemaRefreshSchedule && parseObject(this.schemaRefreshSchedule),
        schemaFilters: this.schemaFilters && parseObject(this.schemaFilters),
        allowWritebackCells: this.allowWritebackCells,
        includeMagic: this.includeMagic,
        connectViaSsh: this.connectViaSsh,
        description: this.description,
        connectionDetails: this.connectionDetails && parseObject(this.connectionDetails),
        type: this.type,
        name: this.name,
      },
    });

    $.export("$summary", `Successfully created group with ID: ${response.id}`);
    return response;
  },
};
