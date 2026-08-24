// x-pd-ai: optimized
import { OBJECT_TYPE } from "../../common/constants.mjs";
import common from "../common/common-get-object.mjs";

export default {
  ...common,
  key: "hubspot-get-meeting",
  name: "Get Meeting",
  description:
    "Get a single meeting engagement from HubSpot by its id, with a default set of meeting properties. Add **Additional properties to retrieve** to include more. Example: Object ID `123`. Returns the meeting record (title, body, start/end time). [See the documentation](https://developers.hubspot.com/docs/reference/api/crm/engagements/meetings#get-%2Fcrm%2Fv3%2Fobjects%2Fmeetings%2F%7Bmeetingid%7D)",
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
