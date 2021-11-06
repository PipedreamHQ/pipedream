import { createWriteStream } from "fs";
import * as stream from "stream";
import { promisify } from "util";
import typeform from "../../typeform.app.mjs";
import common from "../common.mjs";
import constants from "../constants.mjs";

const pipeline = promisify(stream.pipeline);

export default {
  key: "typeform-get-response-file",
  name: "Get a Response File",
  description: "Retrieves a file uploaded as an answer for a submission. [See the docs here](https://developer.typeform.com/responses/reference/retrieve-response-file/)",
  type: "action",
  version: "0.0.1",
  methods: common.methods,
  props: {
    typeform,
    formId: {
      propDefinition: [
        typeform,
        "formId",
      ],
    },
    fieldId: {
      description: "The unique ID for the file upload field (.e.g., `WOTdC00F8A3h`)",
      propDefinition: [
        typeform,
        "field",
        ({ formId }) => ({
          formId,
          allowedFields: [
            constants.FIELD_TYPES.FILE_UPLOAD,
          ],
        }),
      ],
    },
    responseId: {
      propDefinition: [
        typeform,
        "responseId",
        ({
          page, formId, fieldId,
        }) => ({
          page,
          formId,
          fieldId,
        }),
      ],
    },
    filePath: {
      type: "string",
      label: "Destination File Path",
      description: "The destination path for the file in /tmp (e.g., `/tmp/myFile.png`).",
    },
  },
  async run({ $ }) {
    const {
      formId,
      fieldId,
      responseId,
      filePath,
    } = this;

    try {
      const { items: responses } =
        await this.typeform.getResponses({
          $,
          formId,
          params: {
            included_response_ids: responseId,
          },
        });

      const [
        response,
      ] = responses;

      const answer = response?.answers.find(({ field }) => field.id === fieldId) ?? {};
      const fileUrl = answer[answer.type];

      if (!fileUrl) {
        throw new Error("File url not found");
      }

      const uploadedFile =
        await this.typeform.getFile({
          $,
          fileUrl,
        });

      await pipeline(uploadedFile, createWriteStream("/dev/null"));

      const { headers } = uploadedFile;
      const { [constants.CONTENT_DISPOSITION_HEADER]: contentDisposition } = headers;
      const [
        ,
        filenameRaw,
      ] = contentDisposition.split(constants.CONTENT_DISPOSITION_SEPARATOR);
      const filename = filenameRaw.replace(/"/g, "");

      const responseFile =
        await this.typeform.getResponseFile({
          $,
          formId,
          responseId,
          fieldId,
          filename,
        });

      await pipeline(responseFile, createWriteStream(filePath));

      return filePath;

    } catch (error) {
      throw new Error(error);
    }
  },
};
