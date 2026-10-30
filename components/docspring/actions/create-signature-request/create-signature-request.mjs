import { ConfigurationError } from "@pipedream/platform";
import docspring from "../../docspring.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "docspring-create-signature-request",
  name: "Create Signature Request",
  description: "Create a submission that one or more people fill in and sign, and a signing link for each of them."
    + " The PDF is generated once every signer has signed: use the **New Event (Instant)** trigger with `submission.processed` to get it."
    + " Returns the submission, with `signing_url` on each of its `signature_requests`, and `first_signature_request_id` and `first_signing_url`."
    + " Each signer needs the names of the fields they fill in (see **List Template Fields**); each field can be in only one signer's list."
    + " Use **Create Signing Link** to make a new link later."
    + " [See the documentation](https://docspring.com/docs/api/#tag/submissions/post/templates/{template_id}/submissions)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    docspring,
    templateId: {
      propDefinition: [
        docspring,
        "templateId",
      ],
      reloadProps: true,
    },
    templateVersion: {
      propDefinition: [
        docspring,
        "templateVersion",
      ],
      reloadProps: true,
    },
    numberOfSigners: {
      type: "integer",
      label: "Number of Signers",
      description: "How many people fill in and sign the PDF, e.g. `2`. Each one gets their own name, email, fields and authentication inputs.",
      default: 1,
      min: 1,
      max: 100,
      reloadProps: true,
    },
    signingLinkType: {
      propDefinition: [
        docspring,
        "signingLinkType",
      ],
      description: "The signing link to make for each signer: `email` links open the form for 7 days, `api` links for 24 hours,"
        + " and `none` makes no links (use **Create Signing Link** later). e.g. `email`.",
      options: [
        ...constants.SIGNING_LINK_TYPE_OPTIONS,
        {
          label: "None",
          value: "none",
        },
      ],
    },
    data: {
      propDefinition: [
        docspring,
        "data",
      ],
      description: "Values for the template's fields that you already have, by field name, e.g. `{\"landlord_name\": \"Jane Doe\"}`."
        + " Dates are `YYYY-MM-DD`. Don't send values for signature or initials fields: only the signers sign."
        + " A field in a signer's list that has a value here needs that signer's **Prefilled Values Editable**.",
    },
    test: {
      propDefinition: [
        docspring,
        "test",
      ],
    },
    metadata: {
      propDefinition: [
        docspring,
        "metadata",
      ],
    },
  },
  async additionalProps() {
    const count = Math.min(Math.max(utils.toInteger(this.numberOfSigners, "Number of Signers") || 1, 1), 100);
    let fieldOptions;
    if (this.templateId) {
      try {
        const { fields } = await this.docspring.listTemplateFields({
          templateId: this.templateId,
          params: {
            version: this.templateVersion || "latest",
          },
        });
        fieldOptions = utils.signerFieldNames(fields);
      } catch {
        // The template can't be read yet (e.g. its ID comes from an earlier step), so the
        // field names are typed in instead of picked.
        fieldOptions = undefined;
      }
    }
    const props = {};
    for (let i = 1; i <= count; i++) {
      props[`signer${i}Name`] = {
        type: "string",
        label: `Signer ${i} Name`,
        description: `The name of signer ${i}, e.g. \`Jane Doe\`.`,
        optional: true,
      };
      props[`signer${i}Email`] = {
        type: "string",
        label: `Signer ${i} Email`,
        description: `The email address of signer ${i}, e.g. \`jane@example.com\`.`,
        optional: true,
      };
      props[`signer${i}Fields`] = {
        type: "string[]",
        label: `Signer ${i} Fields`,
        description: `The names of the fields signer ${i} fills in, e.g. \`["tenant_name", "tenant_signature"]\`.`
          + " Use **List Template Fields** to find them (the `fields[].name` field). Each field can be in only one signer's list.",
        options: fieldOptions,
      };
      props[`signer${i}Role`] = {
        type: "string",
        label: `Signer ${i} Role`,
        description: "Which of the template's signers this person is, from `Signer 1` to `Signer 100`, e.g. `Signer 2`."
          + " Leave blank to number signers in order. Either every signer has a role or none does: give each one a role to leave a signer out.",
        optional: true,
      };
      props[`signer${i}AuthType`] = {
        type: "string",
        label: `Signer ${i} Authentication`,
        description: "How your app authenticated this person before giving them the link, for the audit trail, e.g. `email_link`.",
        options: constants.AUTH_TYPE_OPTIONS,
        default: "email_link",
        optional: true,
      };
      props[`signer${i}AuthProvider`] = {
        type: "string",
        label: `Signer ${i} Authentication Provider`,
        description: "The service that authenticated them, e.g. `google`. Required when the authentication is `oauth`.",
        optional: true,
      };
      props[`signer${i}PrefilledValuesEditable`] = {
        type: "boolean",
        label: `Signer ${i} Prefilled Values Editable`,
        description: "`true` lets this signer change values that **Data** already has for their fields. A field with a value in **Data** needs it. e.g. `true`.",
        optional: true,
      };
      props[`signer${i}IgnoreUnknownFields`] = {
        type: "boolean",
        label: `Signer ${i} Ignore Unknown Fields`,
        description: "`true` leaves out field names the template doesn't have, for one list you use with several templates. e.g. `true`.",
        optional: true,
      };
    }
    return props;
  },
  methods: {
    /**
     * The signature requests to create, from the signer inputs.
     * @returns {object[]}
     */
    buildSignatureRequests() {
      const count = utils.toInteger(this.numberOfSigners, "Number of Signers") || 1;
      const signatureRequests = [];
      for (let i = 1; i <= count; i++) {
        const fields = utils.parseStringArray(this[`signer${i}Fields`]);
        if (!fields) {
          throw new ConfigurationError(`Signer ${i} needs the names of the fields they fill in (**Signer ${i} Fields**), e.g. \`["tenant_signature"]\``);
        }
        const authType = this[`signer${i}AuthType`] || "email_link";
        const authProvider = this[`signer${i}AuthProvider`];
        if (authType === "oauth" && utils.isBlank(authProvider)) {
          throw new ConfigurationError(`Signer ${i} is authenticated with \`oauth\`, so it needs an **Authentication Provider**, e.g. \`google\``);
        }
        signatureRequests.push(utils.compact({
          name: this[`signer${i}Name`],
          email: this[`signer${i}Email`],
          role: this[`signer${i}Role`],
          fields,
          auth_type: authType,
          auth_provider: authProvider,
          prefilled_values_editable: utils.toBoolean(this[`signer${i}PrefilledValuesEditable`], `Signer ${i} Prefilled Values Editable`),
          ignore_unknown_fields: utils.toBoolean(this[`signer${i}IgnoreUnknownFields`], `Signer ${i} Ignore Unknown Fields`),
        }));
      }
      const withRoles = signatureRequests.filter((request) => request.role).length;
      if (withRoles > 0 && withRoles < signatureRequests.length) {
        throw new ConfigurationError("Give every signer a role, or none of them");
      }
      return signatureRequests;
    },
  },
  async run({ $ }) {
    const signatureRequests = this.buildSignatureRequests();
    const submission = await this.docspring.createSubmission({
      $,
      templateId: this.templateId,
      params: utils.compact({
        version: this.templateVersion,
      }),
      data: utils.compact({
        data: utils.parseObject(this.data, "Data"),
        test: utils.toBoolean(this.test, "Test") || undefined,
        metadata: utils.parseObject(this.metadata, "Metadata"),
        signature_requests: signatureRequests,
      }),
    });

    const linkType = this.signingLinkType || "email";
    const withLinks = [];
    for (const signatureRequest of submission.signature_requests || []) {
      let signingUrl = null;
      if (linkType !== "none" && signatureRequest.state === "pending") {
        let token;
        try {
          token = await this.docspring.createSignatureRequestToken({
            $,
            signatureRequestId: signatureRequest.id,
            data: {
              type: linkType,
            },
          });
        } catch (error) {
          // The submission exists now: name it, so the step isn't rerun to make a second one.
          throw new Error(`Created submission ${submission.id}, but couldn't create a signing link for signature request ${signatureRequest.id}. `
            + `Use Create Signing Link to try again.\n${error.message}`);
        }
        signingUrl = token.signature_request_url;
      }
      withLinks.push({
        ...signatureRequest,
        signing_url: signingUrl,
      });
    }
    const [
      first,
    ] = withLinks;
    $.export("$summary", `Created submission ${submission.id} with ${withLinks.length} signature request(s)`);
    return {
      ...submission,
      signature_requests: withLinks,
      first_signature_request_id: first
        ? first.id
        : null,
      first_signing_url: first
        ? first.signing_url
        : null,
    };
  },
};
