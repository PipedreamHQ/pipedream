import craftmypdf from "../../craftmypdf.app.mjs";

export default {
  key: "craftmypdf-merge-pdf",
  name: "Merge PDF",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a PDF file from multiple templates. It merges all the PDFs into one. [See the documentation](https://craftmypdf.com/docs/index.html#tag/PDF-Generation-API/operation/create-merge)",
  type: "action",
  props: {
    craftmypdf,
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
    paging: {
      type: "string",
      label: "Paging",
      description: "It detemines the paging for the next PDF, either is `continuous` or `reset` . Default to `reset` - continuous : The expression {{sys.totalPages}} is the sum of the merged PDF and the {{sys.pageNumber}} continue from the last PDF page number. - reset: The expression {{sys.totalPages}} is the total pages of current PDF and the {{sys.pageNumber}} auto-reset to zero in the next PDF.",
      options: [
        "continuous",
        "reset",
      ],
      optional: true,
    },
    cloudStorage: {
      propDefinition: [
        craftmypdf,
        "cloudStorage",
      ],
      optional: true,
    },
    templateNumber: {
      type: "integer",
      label: "Quantity of Templates",
      description: "The number of templates you want to merge.",
      reloadProps: true,
    },
  },
  async additionalProps() {
    return Array.from({
      length: this.templateNumber,
    }).reduce((acc, _, index) => {
      const pos = index + 1;

      return {
        ...acc,
        [`templateId-${pos}`]: {
          type: "string",
          label: `Template Id ${pos}`,
          description: "The Id of the template.",
          options: async ({ page }) => {
            const { templates } = await this.craftmypdf.listTemplates({
              params: {
                offset: page * 300,
              },
            });

            return templates.map(({
              template_id: value, name: label,
            }) => ({
              label,
              value,
            }));
          },
        },
        [`data-${pos}`]: {
          type: "string",
          label: `Data ${pos}`,
          description: "JSON data based on the template structure.",
        },
      };
    }, {});
  },
  methods: {
    getTemplate(index) {
      const pos = index + 1;
      const {
        [`templateId-${pos}`]: template_id,
        [`data-${pos}`]: data,
      } = this;
      return {
        template_id,
        data,
      };
    },
    getTemplates(templateNumber) {
      return Array.from({
        length: templateNumber,
      }).map((_, index) => this.getTemplate(index));
    },
  },
  async run({ $ }) {
    const {
      craftmypdf,
      outputFile,
      cloudStorage,
      templateNumber,
      ...data
    } = this;

    const response = await craftmypdf.mergePDF({
      $,
      data: {
        ...data,
        export_type: "json",
        output_file: outputFile,
        cloud_storage: cloudStorage,
        templates: this.getTemplates(templateNumber),
      },
    });

    $.export("$summary", `A new Merge with Id: ${response.transaction_ref} was successfully created!`);
    return response;
  },
};
