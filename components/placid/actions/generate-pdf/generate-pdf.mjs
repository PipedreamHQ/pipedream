import app from "../../placid.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "placid-generate-pdf",
  name: "Generate PDF",
  description: "Creates a new PDF based on a specified template. [See the documentation](https://placid.app/docs/2.0/rest/pdfs#create)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    numberOfPages: {
      type: "integer",
      label: "Number Of Pages",
      description: "The number of pages to generate. Defaults to 1.",
      default: 1,
      reloadProps: true,
    },
  },
  methods: {
    pagesPropsMapper(prefix) {
      const {
        [`${prefix}templateId`]: templateId,
        [`${prefix}layers`]: layers,
      } = this;

      return {
        template_uuid: templateId,
        layers: utils.parseLayers(layers),
      };
    },
    async getPagesPropDefinitions({
      prefix, label,
    } = {}) {
      const { data: templates } = await this.app.getTemplates();
      return {
        [`${prefix}templateId`]: {
          ...app.propDefinitions.templateId,
          label: `${label} - Template ID`,
          options: templates.map(({
            uuid: value, title: label,
          }) => ({
            value,
            label,
          })),
        },
        [`${prefix}layers`]: {
          ...app.propDefinitions.layers,
          label: `${label} - Layers`,
        },
      };
    },
    createPdf(args = {}) {
      return this.app.post({
        path: "/pdfs",
        ...args,
      });
    },
  },
  async additionalProps() {
    const {
      numberOfPages,
      getPagesPropDefinitions,
    } = this;

    return utils.getAdditionalProps({
      numberOfFields: numberOfPages,
      fieldName: "page",
      getPropDefinitions: getPagesPropDefinitions,
    });
  },
  async run({ $ }) {
    const {
      createPdf,
      numberOfPages,
      pagesPropsMapper,
    } = this;

    const response = await createPdf({
      $,
      data: {
        pages: utils.getFieldsProps({
          numberOfFields: numberOfPages,
          fieldName: "page",
          propsMapper: pagesPropsMapper,
        }),
      },
    });
    $.export("$summary", `Successfully created PDF with ID: ${response.id}`);
    return response;
  },
};
