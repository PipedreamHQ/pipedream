import docspring from "../../docspring.app.mjs";

export default {
  key: "docspring-create-data-request",
  name: "Create Data Request",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description:
    "Create a submission that waits for one or more people to fill out or sign it, and return a signing link for each recipient. [See the documentation](https://docspring.com/docs).",
  type: "action",
  props: {
    docspring,
    templateId: {
      propDefinition: [
        docspring,
        "templateId",
      ],
    },
    dataRequests: {
      type: "string[]",
      label: "Recipients",
      description:
        "Each item is a JSON object, e.g. `{\"email\":\"jane@example.com\",\"name\":\"Jane Doe\",\"fields\":[\"first_name\"],\"auth_type\":\"email_link\"}`. `auth_type` defaults to `email_link`.",
    },
    data: {
      propDefinition: [
        docspring,
        "data",
      ],
    },
    test: {
      propDefinition: [
        docspring,
        "test",
      ],
    },
  },
  async run({ $ }) {
    const recipients = (this.dataRequests || [])
      .map((r) => (typeof r === "string" ? JSON.parse(r) : r))
      .filter((r) => r && r.email);
    if (!recipients.length) {
      throw new Error("At least one recipient with an email address is required");
    }
    const dataRequests = recipients.map((r) => {
      const entry = { email: r.email, auth_type: r.auth_type || "email_link" };
      if (r.name) entry.name = r.name;
      if (r.fields) {
        entry.fields = Array.isArray(r.fields)
          ? r.fields
          : String(r.fields).split(/[\n,]/).map((s) => s.trim()).filter(Boolean);
      }
      return entry;
    });

    const body = {
      data: this.data || {},
      data_requests: dataRequests,
      test: this.test ?? false,
    };
    const response = await this.docspring.createSubmission({ $, templateId: this.templateId, data: body });
    const submission = response.submission || response;
    const created = submission.data_requests || [];

    // Mint a 30-day email signing link per recipient (one failure shouldn't fail all).
    const enriched = [];
    for (const dr of created) {
      let signingUrl = null;
      if (dr.id && dr.state !== "completed") {
        try {
          const tok = await this.docspring.createToken({ $, dataRequestId: dr.id, params: { type: "email" } });
          signingUrl = (tok.token && tok.token.data_request_url) || null;
        } catch (_e) {
          signingUrl = null;
        }
      }
      enriched.push({ ...dr, signing_url: signingUrl });
    }
    const first = enriched[0] || {};
    const result = {
      ...submission,
      data_requests: enriched,
      first_data_request_id: first.id || null,
      first_signing_url: first.signing_url || null,
    };
    $.export("$summary", `Created data request submission \`${submission.id}\` for ${enriched.length} recipient(s)`);
    return result;
  },
};
