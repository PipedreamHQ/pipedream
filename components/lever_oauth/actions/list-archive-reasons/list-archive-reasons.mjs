import app from "../../lever_oauth.app.mjs";

export default {
  key: "lever_oauth-list-archive-reasons",
  name: "List Archive Reasons",
  description:
    "Returns all archive reasons configured in the Lever account."
    + " Use this to find a reason ID before archiving a candidate with **Archive Opportunity**."
    + " Filter by type to get only hired reasons or only non-hired (rejection) reasons."
    + " Returns each reason's id, text, and type."
    + " [See the documentation](https://hire.lever.co/developer/documentation#list-all-archive-reasons)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    type: {
      type: "string",
      label: "Type",
      description: "Filter by reason type: `hired` for hired reasons, `non-hired` for rejection reasons. Omit to return all.",
      optional: true,
      options: [
        "hired",
        "non-hired",
      ],
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.type) params.type = this.type;

    const response = await this.app.listArchiveReasons({
      $,
      params,
    });
    const reasons = response.data ?? response;
    $.export("$summary", `Retrieved ${reasons.length} archive reason${reasons.length === 1
      ? ""
      : "s"}`);
    return reasons;
  },
};
