import common from "../common.mjs";
import nexweave from "../../nexweave.app.mjs";

export default {
  key: "nexweave-create-image-experience-from-template",
  name: "Create Image Experience from Template",
  description: "Creates an image experience based on a Nexweave template. [See the documentation](https://documentation.nexweave.com/nexweave-api)",
  version: "0.0.1",
  type: "action",
  ...common,
  props: {
    nexweave,
    templateId: {
      propDefinition: [
        nexweave,
        "templateId",
      ],
    },
  },
  methods: {
    getSummary() {
      return "Successfully created image experience";
    },
    async getItemDetails() {
      return this.nexweave.getTemplateDetails(this.templateId);
    },
    async getData() {
      const { // eslint-disable-next-line no-unused-vars
        nexweave, templateId, ...data
      } = this;

      return {
        template_id: templateId,
        data,
      };
    },
  },
};
