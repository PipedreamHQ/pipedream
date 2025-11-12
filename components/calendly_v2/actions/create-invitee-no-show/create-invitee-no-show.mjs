import { axios } from "@pipedream/platform";
import calendly from "../../calendly_v2.app.mjs";

export default {
  key: "calendly_v2-create-invitee-no-show",
  name: "Create Invitee No Show",
  description: "Marks an Invitee as a No Show in Calendly. [See the documentation](https://calendly.stoplight.io/docs/api-docs/cebd8c3170790-create-invitee-no-show).",
  version: "0.0.6",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    calendly,
    eventId: {
      propDefinition: [
        calendly,
        "eventId",
      ],
    },
    inviteeUri: {
      type: "string",
      label: "Invitee URI",
      description: "The invitee to mark as a no show",
      async options({ prevContext }) {
        const params = prevContext.pageToken
          ? {
            page_token: prevContext.pageToken,
          }
          : {};
        const {
          collection, pagination,
        } = await this.calendly.listEventInvitees(params, this.eventId);
        const options = collection?.map(({
          uri: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
        return {
          options,
          context: {
            pageToken: pagination?.next_page_token,
          },
        };
      },
    },
  },
  methods: {
    createInviteeNoShow(opts = {}, $) {
      return axios(
        $,
        this.calendly._makeRequestOpts({
          method: "POST",
          path: "/invitee_no_shows",
          ...opts,
        }),
      );
    },
  },
  async run({ $ }) {
    const response = await this.createInviteeNoShow({
      data: {
        invitee: this.inviteeUri,
      },
    }, $);
    $.export("$summary", `Successfully marked invitee ${this.inviteeUri} as a no show`);
    return response;
  },
};
