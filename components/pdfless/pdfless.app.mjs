import {
  PdfService,
  TemplateService,
} from "@pdfless/pdfless-js";

export default {
  type: "app",
  app: "pdfless",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The unique identifier of the template.",
      async options({ prevContext }) {
        const page = prevContext?.page || 1;
        return {
          options: await this.listTemplatesOpts(page),
          context: {
            page: page + 1,
          },
        };
      },
    },
  },
  methods: {
    async listTemplatesOpts(page) {
      const templateService = new TemplateService(this.$auth.api_key);
      const templates = await templateService.list(page);
      return templates.map((template) => ({
        label: template.name,
        value: template.id,
      }));
    },
    generate({
      templateId,
      payload,
    }) {
      const pdfService = new PdfService(this.$auth.api_key);
      const generatePDFCommand = {
        template_id: templateId,
        payload: JSON.stringify(payload),
      };
      return pdfService.generate(generatePDFCommand);
    },
  },
};
