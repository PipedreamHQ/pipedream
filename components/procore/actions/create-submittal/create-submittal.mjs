import constants from "../../common/constants.mjs";
import app from "../../procore.app.mjs";

export default {
  key: "procore-create-submittal",
  name: "Create Submittal",
  description: "Create a new submittal. [See the documentation](https://developers.procore.com/reference/rest/submittals?version=latest#create-submittal).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    companyId: {
      propDefinition: [
        app,
        "companyId",
      ],
    },
    projectId: {
      optional: false,
      propDefinition: [
        app,
        "projectId",
        ({ companyId }) => ({
          companyId,
        }),
      ],
    },
    number: {
      type: "string",
      label: "Number",
      description: "The Number of the Submittal",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The Description of the Submittal",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The Title of the Submittal",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "The Submittal Type of the Submittal",
      optional: true,
    },
    isPrivate: {
      type: "boolean",
      label: "Private",
      description: "Whether the Submittal is Private or not",
      optional: true,
    },
    revision: {
      type: "string",
      label: "Revision",
      description: "The Revision of the Submittal",
      optional: true,
    },
    locationId: {
      propDefinition: [
        app,
        "locationId",
        ({
          companyId, projectId,
        }) => ({
          companyId,
          projectId,
        }),
      ],
    },
  },
  methods: {
    createSubmittal({
      projectId, ...args
    } = {}) {
      return this.app.post({
        versionPath: constants.VERSION_PATH.V1_1,
        path: `/projects/${projectId}/submittals`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createSubmittal,
      companyId,
      projectId,
      number,
      description,
      title,
      type,
      isPrivate,
      revision,
      locationId,
    } = this;
    const response = await createSubmittal({
      $,
      companyId,
      projectId,
      data: {
        submittal: {
          number,
          description,
          title,
          type,
          private: isPrivate,
          revision,
          location_id: locationId,
        },
      },
    });
    $.export("$summary", `Successfully created submittal with ID \`${response.id}\`.`);
    return response;
  },
};
