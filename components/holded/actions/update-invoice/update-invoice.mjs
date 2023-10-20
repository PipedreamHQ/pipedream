import constants from "../../common/constants.mjs";
import app from "../../holded.app.mjs";

export default {
  key: "holded-update-invoice",
  name: "Update Invoice",
  description: "Modify an existing invoice in Holded. [See the docs](https://developers.holded.com/reference/update-document-1).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
    documentId: {
      propDefinition: [
        app,
        "documentId",
        () => ({
          args: {
            docType: constants.DOC_TYPE.INVOICE,
          },
        }),
      ],
    },
    desc: {
      type: "string",
      label: "Description",
      description: "The description of the invoice.",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "The notes of the invoice.",
      optional: true,
    },
    paymentMethod: {
      optional: true,
      propDefinition: [
        app,
        "paymentMethod",
      ],
    },
  },
  methods: {
    updateInvoice({
      docType = constants.DOC_TYPE.INVOICE, documentId, ...args
    } = {}) {
      return this.app.put({
        path: `/documents/${docType}/${documentId}`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      documentId,
      desc,
      notes,
      paymentMethod,
    } = this;

    const response = await this.updateInvoice({
      step,
      documentId,
      data: {
        desc,
        notes,
        paymentMethod,
      },
    });

    step.export("$summary", `Successfully updated invoice`);

    return response;
  },
};
