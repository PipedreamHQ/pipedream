import { OBJECT_TYPE } from "../../common/constants.mjs";
import common from "../common/common-get-object.mjs";

export default {
  ...common,
  key: "hubspot-get-meeting",
  name: "Get Meeting",
  description: "Retrieves a specific meeting by its ID. [See the documentation](https://developers.hubspot.com/docs/reference/api/crm/engagements/meetings#get-%2Fcrm%2Fv3%2Fobjects%2Fmeetings%2F%7Bmeetingid%7D)",
  version: "0.0.5",
  type: "action",
  props: {
    ...common.props,
    objectId: {
      ...common.props.objectId,
      label: "Meeting ID",
      description: "Hubspot's internal ID for the meeting",
    },
  },
  methods: {
    ...common.methods,
    getObjectType() {
      return OBJECT_TYPE.MEETING;
    },
  },
};
