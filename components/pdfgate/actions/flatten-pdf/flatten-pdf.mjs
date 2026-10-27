import app from "../../pdfgate.app.mjs";
import {
  DOCS_URL, PROCESS_TIMEOUT_MS,
} from "../../common/constants.mjs";
import {
  buildCommonFields, omitBlank,
} from "../../common/utils.mjs";

export default {
  key: "pdfgate-flatten-pdf",
  name: "Flatten PDF",
  description: `Flatten an interactive PDF into a static, non-editable PDF. [See the documentation](${DOCS_URL})`,
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    documentId: {
      propDefinition: [
        app,
        "documentId",
      ],
    },
    fieldNames: {
      type: "string[]",
      label: "Field Names",
      description: "Optional list of form field names to flatten. Leave empty to flatten every field in the document.",
      optional: true,
    },
    preSignedUrlExpiresIn: {
      propDefinition: [
        app,
        "preSignedUrlExpiresIn",
      ],
    },
    metadata: {
      propDefinition: [
        app,
        "metadata",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.flattenPdf({
      $,
      data: {
        documentId: this.documentId,
        jsonResponse: true,
        ...omitBlank({
          fieldNames: this.fieldNames?.length
            ? this.fieldNames
            : undefined,
        }),
        ...buildCommonFields(this),
      },
      timeout: PROCESS_TIMEOUT_MS,
    });
    $.export("$summary", `Successfully flattened document ${this.documentId} into document ${response.id}`);
    return response;
  },
};
