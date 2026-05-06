import app from "../../lever_oauth.app.mjs";

export default {
  key: "lever_oauth-get-resume",
  name: "Get Resume",
  description:
    "Returns parsed resume data for a candidate."
    + " Use this when asked to read or summarize a candidate's resume."
    + " The resume ID comes from the opportunity's application data — use **Get Opportunity** with `expand=applications` or **List Files** to find the resume ID first."
    + " Returns the resume file metadata, parse status (`success`, `pending`, or `failed`), and the opportunity it belongs to."
    + " Note: this returns resume metadata, not the raw file bytes. To download the actual file, use the Lever UI."
    + " [See the documentation](https://hire.lever.co/developer/documentation#retrieve-a-single-resume)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    opportunityId: {
      type: "string",
      label: "Opportunity ID",
      description: "The ID of the opportunity. Use **Search Opportunities** to find opportunity IDs.",
    },
    resumeId: {
      type: "string",
      label: "Resume ID",
      description: "The ID of the resume to retrieve. Use **Get Opportunity** (with expand=applications) or **List Files** to find the resume ID.",
    },
  },
  async run({ $ }) {
    const response = await this.app.getResume(this.opportunityId, this.resumeId, {
      $,
    });
    const resume = response.data ?? response;
    $.export("$summary", `Retrieved resume ${this.resumeId} (parse status: ${resume.parseStatus ?? "unknown"})`);
    return resume;
  },
};
