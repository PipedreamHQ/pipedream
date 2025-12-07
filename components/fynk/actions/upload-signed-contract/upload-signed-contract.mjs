import fynk from "../../fynk.app.mjs";
import { getFileStreamAndMetadata } from "@pipedream/platform";

export default {
  key: "fynk-upload-signed-contract",
  name: "Upload Signed Contract",
  description: "Upload a signed contract as a PDF document to Fynk for storage and tracking. See documentation pages [create document PDF upload URL](https://app.fynk.com/v1/docs#/operations/v1.file-uploads.document-pdf.create), [create document from PDF](https://app.fynk.com/v1/docs#/operations/v1.documents.create-from-pdf)",
  version: "0.0.11",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    fynk,
    contractFile: {
      type: "string",
      label: "Contract File",
      description: "The PDF file to upload. Use the `getFileStreamAndMetadata` helper from `@pipedream/platform` to read the file stream.",
    },
    fileName: {
      type: "string",
      label: "File Name",
      description: "The name of the PDF file",
    },
    initialStage: {
      type: "string",
      label: "Initial Stage",
      description: "The new document will be created in this stage",
      options: [
        {
          label: "Draft",
          value: "draft",
        },
        {
          label: "Signed",
          value: "signed",
        },
      ],
      default: "draft",
    },
    name: {
      type: "string",
      label: "Document Name",
      description: "The new document's name. If omitted, the `file_name` will be used as the new document's name",
      optional: true,
    },
    documentType: {
      propDefinition: [
        fynk,
        "documentType",
      ],
    },
    templateUuid: {
      propDefinition: [
        fynk,
        "templateUuid",
      ],
      label: "Template UUID",
      description: "Copy document settings from the template with this UUID. Document type, metadata, parties, tags, teams, etc. will all be copied. Cannot be provided if `document_type` is set.",
      optional: true,
    },
    ownerEmails: {
      type: "string[]",
      label: "Owner Emails",
      description: "Email addresses of the user(s) from your account who should be given ownership of the new document",
      optional: true,
    },
    tagUuids: {
      propDefinition: [
        fynk,
        "tagUuids",
      ],
    },
  },
  async run({ $ }) {
    const {
      contractFile,
      fileName,
      initialStage,
      name,
      documentType,
      templateUuid,
      ownerEmails,
      tagUuids,
    } = this;

    // Step 1: Get presigned upload URL
    const uploadUrlResponse = await this.fynk.createDocumentPdfUploadUrl({
      $,
    });

    const {
      uuid: fileUploadUuid, url: uploadUrl, headers: uploadHeaders,
    } = uploadUrlResponse.data;

    // Step 2: Upload the file
    const fileStream = await getFileStreamAndMetadata(contractFile);
    console.log("fileStream:", fileStream);
    console.log("uploadHeaders:", uploadHeaders);
    await this.fynk.uploadFileToPresignedUrl({
      $,
      url: uploadUrl,
      headers: uploadHeaders,
      data: fileStream.stream,
    });

    // Step 3: Create document from uploaded PDF
    const data = {
      file_upload_uuid: fileUploadUuid,
      file_name: fileName,
      initial_stage: initialStage,
      ...(name && {
        name,
      }),
      ...(documentType && {
        document_type: documentType,
      }),
      ...(templateUuid && {
        template_uuid: templateUuid,
      }),
      ...(ownerEmails && ownerEmails.length > 0 && {
        owner_emails: ownerEmails,
      }),
      ...(tagUuids && tagUuids.length > 0 && {
        tag_uuids: tagUuids,
      }),
    };

    const response = await this.fynk.createDocumentFromPdf({
      $,
      data,
    });

    $.export("$summary", `Successfully uploaded contract "${response.data.name}" with UUID ${response.data.uuid}`);
    return response;
  },
};

