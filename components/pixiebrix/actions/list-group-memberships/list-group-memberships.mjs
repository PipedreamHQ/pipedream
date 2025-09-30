import app from "../../pixiebrix.app.mjs";

export default {
  key: "pixiebrix-list-group-memberships",
  name: "List Group Memberships",
  description: "Gets the current memberships of a group. [See the PixieBrix API documentation](https://docs.pixiebrix.com/developer-api/team-management-apis#list-group-memberships)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    organizationId: {
      propDefinition: [
        app,
        "organizationId",
      ],
    },
    groupId: {
      propDefinition: [
        app,
        "groupId",
        ({ organizationId }) => ({
          organizationId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      groupId,
    } = this;

    const response = await app.listGroupMemberships({
      $,
      groupId,
    });

    $.export("$summary", `Successfully listed \`${response?.length || 0}\` group membership(s)`);

    return response || [];
  },
};
