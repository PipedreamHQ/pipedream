import app from "../../insighto_ai.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "insighto_ai-add-text-blob",
  name: "Add Text Blob",
  description: "Adds a text blob into an existing data source. [See the documentation](https://api.insighto.ai/docs#/datasource/add_datasourcefile_text_blob_api_v1_datasource__datasource_id__text_blob_post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    dataSourceId: {
      propDefinition: [
        app,
        "dataSourceId",
      ],
    },
    dataSourceType: {
      propDefinition: [
        app,
        "dataSourceType",
        ({ dataSourceId }) => ({
          dataSourceId,
        }),
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the text blob.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the text blob.",
      optional: true,
    },
    orgId: {
      optional: true,
      propDefinition: [
        app,
        "orgId",
      ],
    },
    data: {
      type: "object",
      label: "Attributes",
      description: "The attributes of the text blob.",
      optional: true,
    },
  },
  methods: {
    addTextBlob({
      dataSourceId, ...args
    } = {}) {
      return this.app.post({
        path: `/datasource/${dataSourceId}/text_blob`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      addTextBlob,
      dataSourceId,
      dataSourceType,
      name,
      description,
      orgId,
      data,
    } = this;

    const response = await addTextBlob({
      $,
      dataSourceId,
      params: {
        ds_type: dataSourceType,
        name,
        description,
        org_id: orgId,
      },
      data: utils.parse(data),
    });
    $.export("$summary", `Successfully added text blob with ID \`${response.data?.id}\``);
    return response;
  },
};
