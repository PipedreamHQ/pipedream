import app from "../../mews.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  name: "Add Customer File",
  description: "Add a customer file to the Mews system. [See the documentation](https://mews-systems.gitbook.io/connector-api/operations/customers#add-customer-file)",
  key: "mews-add-customer-file",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    customerId: {
      propDefinition: [
        app,
        "customerId",
      ],
    },
    name: {
      type: "string",
      label: "File Name",
      description: "Name of the file.",
    },
    type: {
      type: "string",
      label: "File Type",
      description: "Type of the file (e.g., image/png, application/pdf).",
      options: [
        "application/pdf",
        "image/bmp",
        "image/gif",
        "image/jpeg",
        "image/png",
        "image/tiff",
      ],
    },
    filePath: {
      propDefinition: [
        app,
        "filePath",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      customerId,
      name,
      type,
      filePath,
    } = this;

    const data = await utils.fromFilePathToBase64(filePath);

    const response = await app.customersAddFile({
      $,
      data: {
        CustomerId: customerId,
        Name: name,
        Type: type,
        Data: data,
      },
    });

    $.export("$summary", `Successfully added file with ID \`${response.FileId}\``);
    return response;
  },
};
