import visualping from "../../visualping.app.mjs";

export default {
  key: "visualping-list-workspace-id-options",
  name: "List Workspace ID Options",
  description: "Discovers the valid `workspaceId` (and, for business/team accounts,"
    + " `organisationId`) values for the connected Visualping account. Call this"
    + " first before any tool that takes a `workspaceId` or `organisationId` prop"
    + " — never guess those ids."
    + " Example: call with no arguments → returns `{ workspaces: [{id, name}, ...],"
    + " organisation: {id, name} }`. On a personal-tier account `workspaces` is"
    + " typically empty and `organisation` is omitted entirely — that's expected,"
    + " not an error."
    + " [See the documentation](https://develop.api.visualping.io/doc.html)",
  version: "1.0.0",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  ai: "optimized",
  props: {
    visualping,
  },
  async run({ $ }) {
    const {
      workspaces, organisation,
    } = await this.visualping.getUserDetails({ $ });

    const result = {
      workspaces: (workspaces || []).map(({
        id, name,
      }) => ({
        id: `${id}`,
        name,
      })),
    };

    if (organisation?.id != undefined) {
      result.organisation = {
        id: `${organisation.id}`,
        name: organisation.name,
      };
    }

    $.export("$summary", `Successfully retrieved ${result.workspaces.length} workspace option${result.workspaces.length === 1
      ? ""
      : "s"}${result.organisation
      ? " and 1 organisation"
      : ""}`);
    return result;
  },
};
