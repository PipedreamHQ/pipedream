import {
  getFieldProps as additionalProps, getProperties,
} from "../../common/utils.mjs";
import tricentisQtest from "../../tricentis_qtest.app.mjs";

export default {
  key: "tricentis_qtest-submit-defect",
  name: "Submit Defect",
  description: "Submit a new defect. [See the documentation](https://documentation.tricentis.com/qtest/od/en/content/apis/apis/defect_apis.htm#SubmitaDefect)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
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
      tricentisQtest, projectId, getProperties, getDataFields, ...fields
    } = this;
    const response = await tricentisQtest.createDefect({
      $,
      projectId,
      data: {
        properties: getProperties(fields),
      },
    });
    $.export("$summary", `Successfully submitted defect (ID: ${response.id})`);
    return response;
  },
};
