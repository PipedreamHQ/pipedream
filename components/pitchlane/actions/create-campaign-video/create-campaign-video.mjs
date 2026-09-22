import pitchlane from "../../pitchlane.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "pitchlane-create-campaign-video",
  name: "Create Campaign Video",
  description: "Creates a new video for a campaign. [See the documentation](https://docs.pitchlane.com/reference#tag/videos/POST/campaigns/{campaignId}/videos)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    pitchlane,
    campaignId: {
      propDefinition: [
        pitchlane,
        "campaignId",
      ],
      reloadProps: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the video to create. If not specified, the title will be generated following the campaign's titleTemplate.",
      optional: true,
    },
    queueForRender: {
      type: "boolean",
      label: "Queue for Render",
      description: "If `true`, the video will automatically be added to the rendering queue to be rendered (default). If `false`, the video will be created in Pitchlane but will not be rendered until the \"Render all Videos\" button is pressed in the Pitchlane UI.",
      optional: true,
      default: false,
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.campaignId) {
      return props;
    }
    try {
      const {
        variableSchema, leadSchemaMapping,
      } = await this.pitchlane.getCampaignSchemas({
        campaignId: this.campaignId,
      });
      const requiredVariables = {};
      for (const [
        key,
        value,
      ] of Object.entries(variableSchema)) {
        if (value.required) {
          const variableKey = key.split("_")[0];
          requiredVariables[variableKey] = true;
        }
      }
      for (const key of Object.keys(leadSchemaMapping)) {
        props[key] = {
          type: "string",
          label: key,
          optional: !requiredVariables[key],
        };
      }
    } catch {
      props.variables = {
        type: "object",
        label: "Variables",
        description: "The schema variables to be used in the video",
      };
    }
    return props;
  },
  async run({ $ }) {
    const {
      pitchlane,
      campaignId,
      title,
      queueForRender,
      variables,
      ...otherVariables
    } = this;

    const response = await pitchlane.createCampaignVideo({
      $,
      campaignId,
      data: {
        queueForRender,
        title,
        variables: {
          ...parseObject(variables),
          ...otherVariables,
        },
      },
    });

    $.export("$summary", `Successfully created video with ID: ${response.id}`);
    return response;
  },
};
