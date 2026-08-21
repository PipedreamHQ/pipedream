import common, { getProps } from "../common/base-create-update.mjs";
import event from "../../common/sobjects/event.mjs";

const docsLink =
  "https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_event.htm";

export default {
  ...common,
  key: "salesforce_rest_api-create-event",
  name: "Create Event",
  description: `Creates an event. [See the documentation](${docsLink})`,
  version: "0.3.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  methods: {
    ...common.methods,
  },
  props: getProps({
    objType: event,
    docsLink,
    showDateInfo: true,
  }),
  async run({ $ }) {
    /* eslint-disable no-unused-vars */
    const {
      salesforce,
      getAdditionalFields,
      formatDateTimeProps,
      docsInfo,
      dateInfo,
      additionalFields,
      ActivityDate,
      EndDateTime,
      ...data
    } = this;
    /* eslint-enable no-unused-vars */
    const response = await salesforce.createRecord("Event", {
      $,
      data: {
        ...data,
        ...formatDateTimeProps({
          ActivityDate,
          EndDateTime,
        }),
        ...getAdditionalFields(),
      },
    });
    $.export("$summary", "Successfully created event");
    return response;
  },
};
