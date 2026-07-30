// x-pd-ai: optimized
import { axios } from "@pipedream/platform";
import calendly from "../../calendly_v2.app.mjs";

export default {
  key: "calendly_v2-create-invitee-no-show",
  name: "Create Invitee No Show",
  description: "Marks an invitee as a no-show via `POST /invitee_no_shows`. Use when an invitee didn't attend a scheduled event and you want to flag it in Calendly. Run **List Events** first to obtain the event UUID, then select the invitee from the dropdown (populated from **List Event Invitees**). Example: with `eventId` set to `a1b2c3d4-e5f6-7890-abcd-ef1234567890`, selecting invitee \"Jane Doe\" marks her as a no-show for that event. [See the documentation](https://calendly.stoplight.io/docs/api-docs/cebd8c3170790-create-invitee-no-show).",
  version: "0.0.7",
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
