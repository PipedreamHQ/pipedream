const zoom = {
  type: "app",
  app: "zoom",
};

module.exports = {
  name: "Zoom Custom Events",
  description:
    "Listen for any events tied to your Zoom user or resources you own",
  version: "0.0.2",
  props: {
    zoom,
    eventNameOptions: {
      label: "Zoom Events",
      type: "string[]",
      async options() {
        return [
          "meeting.alert",
          "meeting.created.by_me",
          "meeting.created.for_me",
          "meeting.updated",
          "meeting.deleted.by_me",
          "meeting.deleted.for_me",
          "meeting.started",
          "meeting.ended",
          "meeting.registration_created",
          "meeting.registration_approved",
          "meeting.registration_cancelled",
          "meeting.registration_denied",
          "meeting.sharing_started.host",
          "meeting.sharing_started.participant",
          "meeting.sharing_ended.host",
          "meeting.sharing_ended.participant",
          "meeting.participant_jbh_joined",
          "meeting.participant_jbh_waiting",
          "meeting.participant_joined",
          "meeting.participant_left",
          "recording.started",
          "recording.paused",
          "recording.resumed",
          "recording.stopped",
          "recording.completed",
          "recording.trashed.by_me",
          "recording.trashed.for_me",
          "recording.deleted.by_me",
          "recording.deleted.for_me",
          "recording.recovered.by_me",
          "recording.recovered.for_me",
          "recording.transcript_completed",
          "recording.registration_created",
          "recording.registration_approved",
          "recording.registration_denied",
          "user.updated",
          "user.settings_updated",
          "user.signed_in",
          "user.signed_out",
          "webinar.created.by_me",
          "webinar.created.for_me",
          "webinar.updated",
          "webinar.started",
          "webinar.ended",
          "webinar.alert",
          "webinar.sharing_started.host",
          "webinar.sharing_started.participant",
          "webinar.sharing_ended",
          "webinar.registration_created",
          "webinar.registration_approved",
          "webinar.registration_denied",
          "webinar.registration_cancelled",
          "webinar.participant_joined",
          "webinar.participant_left",
        ];
      },
    },
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoom",
      async eventNames() {
        return this.eventNameOptions;
      },
    },
  },
  async run(event) {
    console.log(event);
    this.$emit(event, {
      summary: event.event,
    });
  },
};
