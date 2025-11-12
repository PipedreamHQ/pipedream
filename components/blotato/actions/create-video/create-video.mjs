import blotato from "../../blotato.app.mjs";

export default {
  key: "blotato-create-video",
  name: "Create Video",
  description: "Creates a new video using a template. The template takes an ID and input parameters. [See documentation](https://help.blotato.com/api/api-reference/create-video)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    blotato,
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the template to use",
      async options() {
        const { items } = await this.blotato.listTemplates({
          fields: "id,title,description",
        });
        return items.map((template) => ({
          label: template.title || template.id,
          value: template.id,
        }));
      },
    },
    inputs: {
      type: "string",
      label: "Inputs",
      description: "Template-specific input parameters as a string that parses to a JSON object. The structure depends on the selected template.",
    },
    isDraft: {
      type: "boolean",
      label: "Is Draft",
      description: "If true, the video will be created as a draft",
      optional: true,
      default: false,
    },
    render: {
      type: "boolean",
      label: "Render",
      description: "If true, the video will be rendered immediately",
      default: true,
    },
  },
  async run({ $ }) {
    const {
      templateId,
      isDraft,
      render,
    } = this;

    const inputs = JSON.parse(this.inputs);

    const response = await this.blotato.createVideoFromTemplate({
      $,
      templateId,
      inputs,
      isDraft,
      render,
    });

    $.export("$summary", `Successfully created video with ID: ${response.item.id}. Status: ${response.item.status}. To view progress, visit https://my.blotato.com/videos/${response.item.id}`);

    return response;
  },
};
