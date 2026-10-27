import docspring from "../../docspring.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "docspring-check-data",
  name: "Check Data",
  description: "Check data against a template without making a PDF or saving anything. Returns `valid`, and when it's `false`, an `error` that lists each problem in `details`."
    + " Use it before **Generate PDF** or **Create Signature Request**; it checks signers in the same way."
    + " [See the documentation](https://docspring.com/docs/api/#tag/submissions/post/templates/{template_id}/submissions/validate)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    docspring,
    templateId: {
      propDefinition: [
        docspring,
        "templateId",
      ],
    },
    templateVersion: {
      propDefinition: [
        docspring,
        "templateVersion",
      ],
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
      description: "`true` checks the data for a test PDF, `false` (the default) for a live one. A test API token can only make test PDFs. e.g. `true`.",
    },
    signatureRequests: {
      type: "string[]",
      label: "Signature Requests",
      description: "Optional signers to check with the data, as **Create Signature Request** would send them. Each item is a JSON object with `fields` and `auth_type`,"
        + " e.g. `{\"name\": \"Jane Doe\", \"email\": \"jane@example.com\", \"fields\": [\"tenant_signature\"], \"auth_type\": \"email_link\"}`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const result = await this.docspring.validateSubmission({
      $,
      templateId: this.templateId,
      params: utils.compact({
        version: this.templateVersion,
      }),
      data: utils.compact({
        data: utils.parseObject(this.data, "Data") || {},
        test: utils.toBoolean(this.test, "Test") || undefined,
        signature_requests: utils.parseObjectArray(this.signatureRequests, "Signature Requests"),
      }),
    });
    const problems = result.error?.details?.length ?? 0;
    $.export("$summary", result.valid
      ? `The data is valid for template ${result.template_id}`
      : `The data isn't valid for template ${result.template_id}: ${problems} problem(s)`);
    return result;
  },
};
