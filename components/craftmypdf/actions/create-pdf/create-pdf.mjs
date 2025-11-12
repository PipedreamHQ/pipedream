import craftmypdf from "../../craftmypdf.app.mjs";

export default {
  key: "craftmypdf-create-pdf",
  name: "Create PDF",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new pdf. [See the documentation](https://craftmypdf.com/docs/index.html#tag/PDF-Generation-API/operation/create)",
  type: "action",
  props: {
    craftmypdf,
    data: {
      propDefinition: [
        craftmypdf,
        "data",
      ],
    },
    loadDataFrom: {
      propDefinition: [
        craftmypdf,
        "loadDataFrom",
      ],
      optional: true,
    },
    templateId: {
      propDefinition: [
        craftmypdf,
        "templateId",
      ],
    },
    version: {
      propDefinition: [
        craftmypdf,
        "templateVersion",
        ({ templateId }) => ({
          templateId,
        }),
      ],
      optional: true,
    },
    expiration: {
      propDefinition: [
        craftmypdf,
        "expiration",
      ],
      optional: true,
    },
    outputFile: {
      propDefinition: [
        craftmypdf,
        "outputFile",
      ],
      optional: true,
    },
    isCMYK: {
      type: "boolean",
      label: "Is CMYK",
      description: "Use CMYK color profile, default to 'false'.",
      optional: true,
    },
    imageResampleRes: {
      type: "integer",
      label: "Image Resample Res",
      description: "Optimize/downsample images of current PDF to a resolution(in DPI). This helps to reduce the PDF file size. Suggested values are 1200, 600, 300, 150 or 72.",
      optional: true,
    },
    cloudStorage: {
      propDefinition: [
        craftmypdf,
        "cloudStorage",
      ],
      optional: true,
    },
    pdfStandard: {
      type: "string",
      label: "PDF Standard",
      description: "Default to PDF1.7. PDFA3 is an experimental feature.",
      options: [
        "PDF1.7",
        "PDFA1B",
        "PDFA2",
        "PDFA3",
      ],
      optional: true,
    },
    passwordProtected: {
      type: "boolean",
      label: "Password Protected",
      description: "Enable password protection.",
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.passwordProtected) {
      props.password = {
        type: "string",
        label: "Password",
        description: "Specify a password.",
      };
    }
    return props;
  },
  async run({ $ }) {
    const {
      craftmypdf,
      loadDataFrom,
      templateId,
      outputFile,
      isCMYK,
      imageResampleRes,
      cloudStorage,
      pdfStandard,
      passwordProtected,
      ...data
    } = this;

    const response = await craftmypdf.createPDF({
      $,
      data: {
        ...data,
        load_data_from: loadDataFrom,
        template_id: templateId,
        export_type: "json",
        output_file: outputFile,
        is_cmyk: isCMYK,
        image_resample_res: imageResampleRes,
        directDownload: 0,
        cloud_storage: cloudStorage,
        pdf_standard: pdfStandard,
        password_protected: passwordProtected,
      },
    });

    $.export("$summary", `A new PDF with Id: ${response.transaction_ref} was successfully created!`);
    return response;
  },
};
