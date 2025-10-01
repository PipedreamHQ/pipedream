import fs from "fs";
import path from "path";
import app from "../../sendcloud.app.mjs";

export default {
  key: "sendcloud-list-parcel-documents",
  name: "List Parcel Documents",
  description: "List parcel documents. [See the documentation](https://api.sendcloud.dev/docs/sendcloud-public-api/parcel-documents/operations/get-a-parcel-document-1)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    type: {
      type: "string",
      label: "Type",
      description: "Document type you want to retrieve.",
      options: [
        "label",
        "customs-declaration",
        "air-waybill",
      ],
    },
    parcels: {
      type: "string[]",
      label: "Parcels",
      description: "IDs of parcels to retrieve documents. Example: [1, 2, 3]",
      propDefinition: [
        app,
        "parcelId",
      ],
    },
    paperSize: {
      type: "string",
      label: "Paper Size",
      description: "Optional. One of `A4`, `A5`, `A6`. If omitted, the document's internal paper size is used.",
      optional: true,
      options: [
        "A4",
        "A5",
        "A6",
      ],
    },
    header: {
      type: "string",
      label: "Header",
      description: "The type of document to return. Default is `application/pdf`.",
      optional: true,
      options: [
        "application/pdf",
        "application/zpl",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      type,
      parcels,
      paperSize,
      header,
    } = this;

    const response = await app.listParcelDocuments({
      $,
      type,
      params: {
        parcels,
        paper_size: paperSize,
      },
      headers: {
        Accept: header || "application/pdf",
      },
    });

    const filePath = path.join("/tmp", `${type}-${Date.now()}.pdf`);
    fs.writeFileSync(filePath, response);

    $.export("$summary", "Successfully listed parcel documents");

    return {
      filePath,
    };
  },
};

