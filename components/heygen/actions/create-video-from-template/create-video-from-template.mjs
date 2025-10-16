import common from "../common/video-polling.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  ...common,
  key: "heygen-create-video-from-template",
  name: "Create Video From Template",
  description: "Generates a video from a selected template. [See the documentation](https://docs.heygen.com/reference/generate-template)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    templateId: {
      propDefinition: [
        common.props.heygen,
        "templateId",
      ],
      reloadProps: true,
    },
    title: {
      propDefinition: [
        common.props.heygen,
        "title",
      ],
      optional: true,
    },
    test: {
      propDefinition: [
        common.props.heygen,
        "test",
      ],
      optional: true,
    },
    caption: {
      propDefinition: [
        common.props.heygen,
        "caption",
      ],
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.templateId) {
      return props;
    }
    try {
      const { data } = await this.heygen.getTemplate({
        templateId: this.templateId,
      });
      for (const [
        key,
        value,
      ] of Object.entries(data.variables)) {
        props[key] = {
          type: "string",
          label: `${key} Properties`,
          default: JSON.stringify(value.properties),
          optional: true,
        };
      }
      return props;
    } catch {
      throw new ConfigurationError("Template must contain variables.");
    }
  },
  methods: {
    ...common.methods,
    async processVideo($) {
      const { data: template } = await this.heygen.getTemplate({
        templateId: this.templateId,
        $,
      });
      const variables = {};
      for (const [
        key,
        value,
      ] of Object.entries(template.variables)) {
        let properties = value.properties;
        if (this[key]) {
          properties = typeof this[key] === "string"
            ? JSON.parse(this[key])
            : this[key];
        }
        variables[key] = {
          ...value,
          properties,
        };
      }
      const { data } = await this.heygen.generateVideoFromTemplate({
        templateId: this.templateId,
        data: {
          title: this.title,
          test: this.test,
          caption: this.caption,
          variables,
        },
        $,
      });
      return data.video_id;
    },
  },
};
