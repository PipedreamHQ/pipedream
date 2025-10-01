import { parseObject } from "../../common/utils.mjs";
import fogbugz from "../../fogbugz.app.mjs";

export default {
  key: "fogbugz-create-case",
  name: "Create Case",
  description: "Creates a new case on FogBugz. [See the documentation](https://support.fogbugz.com/hc/en-us/articles/360011330713-FogBugz-XML-API-Editing-Cases)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    fogbugz,
    ixBugParent: {
      propDefinition: [
        fogbugz,
        "ixBugParentId",
      ],
      optional: true,
    },
    sTitle: {
      propDefinition: [
        fogbugz,
        "sTitle",
      ],
    },
    sTags: {
      propDefinition: [
        fogbugz,
        "sTags",
      ],
      optional: true,
    },
    ixProject: {
      propDefinition: [
        fogbugz,
        "ixProjectId",
      ],
      optional: true,
    },
    ixArea: {
      propDefinition: [
        fogbugz,
        "ixAreaId",
      ],
      optional: true,
    },
    ixCategory: {
      propDefinition: [
        fogbugz,
        "ixCategoryId",
        ({ ixProject }) => ({
          ixProject,
        }),
      ],
      optional: true,
    },
    ixPersonId: {
      propDefinition: [
        fogbugz,
        "ixPersonId",
      ],
      label: "Ix Person Assigned To",
      description: "The Id of the Person assigned to the case.",
      optional: true,
    },
    ixPriority: {
      propDefinition: [
        fogbugz,
        "ixPriorityId",
      ],
      optional: true,
    },
  },
  methods: {
    async createCase({
      data, ...opts
    }) {
      return await this.fogbugz.post({
        data: {
          cmd: "new",
          ...data,
        },
        ...opts,
      });
    },
  },
  async run({ $ }) {
    const response = await this.createCase({
      $,
      data: {
        ixBugParent: this.ixBugParent,
        sTitle: this. sTitle,
        sTags: parseObject(this.sTags).toString(),
        ixProject: this.ixProject,
        ixArea: this.ixArea,
        ixCategory: this.ixCategory,
        ixPersonAssignedTo: this.ixPersonId,
        ixPriority: this.ixPriority,
      },
    });
    $.export("$summary", `Successfully created case with Id: ${response.data?.case?.ixBug}`);
    return response;
  },
};
