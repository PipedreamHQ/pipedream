import docspring from "../../docspring.app.mjs";
import utils from "../../common/utils.mjs";
import signerEmails from "../../common/signer-emails.mjs";

export default {
  key: "docspring-check-data",
  name: "Check Data",
  description: "Check data against a template without making a PDF or saving anything. Returns `valid`, and when it's `false`, an `error` that lists each problem in `details`."
    + " Use it before **Generate PDF** or **Create Signature Request**; it checks signers, and whether DocSpring emails them, in the same way."
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
      description: "Optional signers to check with the data, as **Create Signature Request** would send them. Each item is a JSON object with `fields`"
        + " and an `auth_type` (`email_link` when left out),"
        + " e.g. `{\"name\": \"Jane Doe\", \"email\": \"jane@example.com\", \"fields\": [\"tenant_signature\"], \"auth_type\": \"email_link\"}`."
        + " Empty values are left out.",
      optional: true,
    },
    sendEmail: {
      ...signerEmails.sendEmailProp,
      label: signerEmails.sendEmailProp.label,
      description: "With **Signature Requests**: who sends the signers their links, as in **Create Signature Request**. "
        + signerEmails.sendEmailProp.description,
    },
    signingOrder: {
      ...signerEmails.signingOrderProp,
      label: signerEmails.signingOrderProp.label,
      description: "`parallel` (the default): everyone can sign at once. `sequential`: people sign one step at a time, in the order of each signature request's `signing_step`, or of the list."
        + " Applies only with **Signature Requests**. e.g. `sequential`.",
    },
  },
  async additionalProps() {
    return signerEmails.propsEmailMode(this.sendEmail) === "docspring"
      ? signerEmails.emailOptionProps()
      : {};
  },
  async run({ $ }) {
    // A blank value (`"email": ""` from an empty mapped field) is left out: the API refuses
    // blank text. As in Create Signature Request, an email is trimmed and `auth_type` defaults
    // to `email_link` (the API requires it when you send the links yourself).
    const signatureRequests = utils.parseObjectArray(this.signatureRequests, "Signature Requests")
      ?.map((request) => utils.compact({
        ...request,
        email: typeof request.email === "string"
          ? request.email.trim()
          : request.email,
      }))
      .map((request) => ({
        ...request,
        auth_type: request.auth_type ?? "email_link",
      }));
    // The email settings only go with signers: the API refuses them without.
    const settings = signatureRequests
      ? signerEmails.emailSettings(this)
      : {};
    const result = await this.docspring.validateSubmission({
      $,
      templateId: this.templateId,
      params: utils.compact({
        version: this.templateVersion,
      }),
      data: utils.compact({
        data: utils.parseObject(this.data, "Data") || {},
        test: utils.toBoolean(this.test, "Test") || undefined,
        signature_requests: signatureRequests,
        ...settings,
      }),
    });
    const problems = result.error?.details?.length ?? 0;
    $.export("$summary", result.valid
      ? `The data is valid for template ${result.template_id}`
      : `The data isn't valid for template ${result.template_id}: ${problems} problem(s)`);
    return result;
  },
};
