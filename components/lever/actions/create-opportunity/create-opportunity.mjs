import app from "../../lever.app.mjs";

export default {
  key: "lever-create-opportunity",
  name: "Create Opportunity",
  description:
    "Creates a new opportunity (candidate + application) in Lever."
    + " Use this to add a new candidate to the pipeline, optionally applying them to a specific job posting."
    + " Use **List Postings** to find posting IDs, **List Stages** to find stage IDs, and **List Users** to find the recruiter user ID for Perform As."
    + " Perform As is required — it sets the opportunity creator and owner."
    + " If a candidate with the same email already exists, Lever will link the new opportunity to the existing contact rather than creating a duplicate."
    + " WARNING: only one posting UID may be specified per request."
    + " Example: to add Jane Doe as a referred candidate on a posting, call with performAs=\"<userId>\", candidateName=\"Jane Doe\", email=\"jane@example.com\", postingId=\"<postingId>\", origin=\"referred\" → returns the created opportunity with its `id`."
    + " [See the documentation](https://hire.lever.co/developer/documentation#create-an-opportunity)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    performAs: {
      propDefinition: [
        app,
        "performAs",
      ],
      description: "User ID of the recruiter creating this opportunity — sets the creator and default owner. Use **List Users** to find user IDs.",
    },
    candidateName: {
      type: "string",
      label: "Candidate Name",
      description: "Full name of the candidate.",
    },
    headline: {
      type: "string",
      label: "Headline",
      description: "Current job title and company (e.g. `Senior Engineer at Acme Corp`).",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Candidate's email address. Used for deduplication — if a contact with this email already exists, the opportunity will be linked to them.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Candidate's phone number.",
      optional: true,
    },
    postingId: {
      propDefinition: [
        app,
        "postingId",
      ],
      description: "Job posting to apply this candidate to. Use **List Postings** to find posting IDs. Only one posting per request.",
    },
    stageId: {
      propDefinition: [
        app,
        "stageId",
      ],
      description: "Initial pipeline stage. Use **List Stages** to find stage IDs. Defaults to 'New Lead' if omitted.",
    },
    origin: {
      propDefinition: [
        app,
        "origin",
      ],
      description: "How the candidate entered the pipeline (e.g. `referred`, `sourced`, `applied`).",
    },
    tags: {
      type: "string",
      label: "Tags",
      description: "Comma-separated list of tags to apply (e.g. `python,senior,remote`).",
      optional: true,
    },
    sources: {
      type: "string",
      label: "Sources",
      description: "Comma-separated list of sources (e.g. `LinkedIn,Referral`).",
      optional: true,
    },
    links: {
      type: "string",
      label: "Links",
      description: "Comma-separated list of URLs to social profiles or portfolio (e.g. `https://linkedin.com/in/jane,https://github.com/jane`).",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      perform_as: this.performAs,
    };

    const emails = this.email
      ? [
        this.email,
      ]
      : undefined;
    const phones = this.phone
      ? [
        {
          value: this.phone,
        },
      ]
      : undefined;
    const postings = this.postingId
      ? [
        this.postingId,
      ]
      : undefined;
    const tags = this.tags
      ? this.tags.split(",").map((t) => t.trim())
      : undefined;
    const sources = this.sources
      ? this.sources.split(",").map((s) => s.trim())
      : undefined;
    const links = this.links
      ? this.links.split(",").map((l) => l.trim())
      : undefined;

    const body = {
      name: this.candidateName,
    };
    if (this.headline) body.headline = this.headline;
    if (emails) body.emails = emails;
    if (phones) body.phones = phones;
    if (postings) body.postings = postings;
    if (this.stageId) body.stage = this.stageId;
    if (this.origin) body.origin = this.origin;
    if (tags) body.tags = tags;
    if (sources) body.sources = sources;
    if (links) body.links = links;

    const response = await this.app.createOpportunity({
      $,
      params,
      data: body,
    });
    const opportunity = response.data ?? response;
    $.export("$summary", `Created opportunity for ${this.candidateName} (${opportunity.id})`);
    return opportunity;
  },
};
