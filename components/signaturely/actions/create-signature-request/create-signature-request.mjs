import utils from "../../common/utils.mjs";
import app from "../../signaturely.app.mjs";

export default {
  key: "signaturely-create-signature-request",
  name: "Create Signature Request",
  description: "Creates a new signature request. [See the documentation](https://docs.signaturely.com/#:~:text=Get%20user-,Create%20signing%20request,-Bulk%20Send%20Signature)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    templateId: {
      propDefinition: [
        app,
        "templateId",
      ],
    },
    signers: {
      type: "string[]",
      label: "Signers",
      description: "The list of signers for the document. For ordered documents must defined `order`. `fields` is an optional dictionary with values for document fields with API tags. The JSON structure for each row is: `{ \"name\": \"John Doe\", \"email\": \"jd@test.com\", \"role\": \"test\", \"order\": 1, \"fields\": { \"field1\": \"value1\", \"field2\": \"value2\" } }`",
    },
    title: {
      type: "string",
      label: "Document Title",
      description: "The title of the document",
      optional: true,
    },
    message: {
      type: "string",
      label: "Document Message",
      description: "The message of the document",
      optional: true,
    },
    isOrdered: {
      type: "boolean",
      label: "Document Ordered Flag",
      description: "Flag indicating if the document is ordered",
      optional: true,
    },
    testMode: {
      type: "boolean",
      label: "Test Mode",
      description: "Flag indicating if the request is a test",
      optional: true,
    },
  },
  methods: {
    createSignatureRequest(args = {}) {
      return this.app.post({
        path: "/document_sign/api/request_by_template",
        ...args,
      });
    },
  },
  run({ $: step }) {
    const {
      // eslint-disable-next-line no-unused-vars
      app,
      createSignatureRequest,
      signers,
      ...data
    } = this;

    return createSignatureRequest({
      step,
      data: {
        ...data,
        signers: utils.parseArray(signers).map(utils.parse),
      },
      summary: (response) => `Successfully created signature request with ID ${response.id}`,
    });
  },
};
