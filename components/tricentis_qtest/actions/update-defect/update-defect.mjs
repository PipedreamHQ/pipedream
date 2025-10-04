import {
  getFieldProps as additionalProps, getProperties,
} from "../../common/utils.mjs";
import tricentisQtest from "../../tricentis_qtest.app.mjs";

export default {
  key: "tricentis_qtest-update-defect",
  name: "Update Defect",
  description: "Update a defect. [See the documentation](https://documentation.tricentis.com/qtest/od/en/content/apis/apis/defect_apis.htm#UpdateADefect)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    tricentisQtest,
    projectId: {
      propDefinition: [
        tricentisQtest,
        "projectId",
      ],
    },
    defectId: {
      propDefinition: [
        tricentisQtest,
        "defectId",
        ({ projectId }) => ({
          projectId,
        }),
      ],
      reloadProps: true,
    },
  },
  additionalProps,
  methods: {
    getDataFields() {
      return this.tricentisQtest.getDefectFields(this.projectId);
    },
    getProperties,
  },
  async run({ $ }) {
    const { // eslint-disable-next-line no-unused-vars
      tricentisQtest, projectId, defectId, getProperties, getDataFields, ...fields
    } = this;
    const response = await tricentisQtest.updateDefect({
      $,
      projectId,
      defectId,
      data: {
        properties: getProperties(fields),
      },
    });
    $.export("$summary", `Successfully updated defect (ID: ${defectId})`);
    return response;
  },
};
