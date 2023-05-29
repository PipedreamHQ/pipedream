import common from "../common/common.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "wix_api_key-new-member-registered",
  name: "New Member Registered",
  description: "Emit new event when a new member is registered. [See the documentation](https://dev.wix.com/api/rest/members/members/list-members)",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    getParams() {
      return {
        "paging.limit": constants.DEFAULT_LIMIT,
        "paging.offset": 0,
        "sort.fieldName": "createdDate",
        "sort.order": "DESC",
      };
    },
    async getResources({
      siteId, params,
    }) {
      const { members } = await this.wix.listMembers({
        siteId,
        params,
      });
      return members;
    },
    advancePage(params) {
      const offset = params["paging.offset"] + constants.DEFAULT_LIMIT;
      return {
        ...params,
        "paging.offset": offset,
      };
    },
    generateMeta(member) {
      return {
        id: member.id,
        summary: member.profile.nickname,
        ts: this.getTs(member),
      };
    },
  },
};
