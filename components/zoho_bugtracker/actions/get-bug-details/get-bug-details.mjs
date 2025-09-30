import zohoBugtracker from "../../zoho_bugtracker.app.mjs";

export default {
  key: "zoho_bugtracker-get-bug-details",
  name: "Get Bug Details",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Get details from a specific bug. [See the documentation](https://www.zoho.com/projects/help/rest-api/bugtracker-bugs-api.html#alink2)",
  type: "action",
  props: {
    zohoBugtracker,
    portalId: {
      propDefinition: [
        zohoBugtracker,
        "portalId",
      ],
    },
    projectId: {
      propDefinition: [
        zohoBugtracker,
        "projectId",
        ({ portalId }) => ({
          portalId,
        }),
      ],
    },
    bugId: {
      propDefinition: [
        zohoBugtracker,
        "bugId",
        ({
          portalId, projectId,
        }) => ({
          portalId,
          projectId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      zohoBugtracker,
      portalId,
      projectId,
      bugId,
    } = this;

    const response = await zohoBugtracker.getBug({
      $,
      portalId,
      projectId,
      bugId,
    });

    $.export("$summary", `The bug with Id: ${bugId} was successfully fetched!`);
    return response;
  },
};
