import { parseObject } from "../../common/utils.mjs";
import hex from "../../hex.app.mjs";

export default {
  key: "hex-edit-data-connection",
  name: "Edit Data Connection",
  description: "Edit a specific data connection. [See the documentation](https://learn.hex.tech/docs/api/api-reference#operation/EditDataConnection)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    hex,
    connectionId: {
      propDefinition: [
        hex,
        "connectionId",
      ],
    },
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
      optional: true,
    },
    name: {
      propDefinition: [
        hex,
        "name",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.hex.updateDataConnection({
      $,
      connectionId: this.connectionId,
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
        name: this.name,
      },
    });

    $.export("$summary", `Successfully updated data connection with ID: ${response.id}`);
    return response;
  },
};
