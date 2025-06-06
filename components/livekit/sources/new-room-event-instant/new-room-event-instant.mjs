import app from "../../livekit.app.mjs";

export default {
  key: "livekit-new-room-event-instant",
  name: "New Room Event (Instant)",
  description: "Emit new event for LiveKit room activities via webhook. [See the documentation](https://docs.livekit.io/home/server/webhooks/).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    http: "$.interface.http",
    eventTypes: {
      type: "string[]",
      label: "Event Types",
      description: "Select which types of events to monitor",
      options: [
        {
          label: "Room Started (e.g., call initiated)",
          value: "room_started",
        },
        {
          label: "Room Finished (e.g., call ended)",
          value: "room_finished",
        },
        {
          label: "Participant Joined (e.g., call answered)",
          value: "participant_joined",
        },
        {
          label: "Participant Left (e.g., call ended)",
          value: "participant_left",
        },
        {
          label: "Track Published (e.g., video track published)",
          value: "track_published",
        },
        {
          label: "Track Unpublished (e.g., video track unpublished)",
          value: "track_unpublished",
        },
        {
          label: "Egress Started (e.g., egress started for recording or streaming)",
          value: "egress_started",
        },
        {
          label: "Egress Updated (e.g., egress updated for recording or streaming)",
          value: "egress_updated",
        },
        {
          label: "Egress Ended (e.g., egress ended for recording or streaming)",
          value: "egress_ended",
        },
        {
          label: "Ingress Started (e.g., ingress started for recording or streaming)",
          value: "ingress_started",
        },
        {
          label: "Ingress Ended (e.g., ingress ended for recording or streaming)",
          value: "ingress_ended",
        },
      ],
    },
    roomNameFilter: {
      type: "string",
      label: "Room Name Filter",
      description: "Only emit events for this specific room. Leave empty to monitor all rooms.",
      optional: true,
    },
  },
  methods: {
    shouldEmitEvent({
      event, room,
    }) {
      // Check if event type is in our filter
      if (!this.eventTypes.includes(event)) {
        return false;
      }

      // Filter by room if specified, with case-insensitive comparison
      if (this.roomNameFilter
        && room?.name?.toLowerCase() !== this.roomNameFilter.toLowerCase()) {
        return false;
      }

      return true;
    },
    generateSummary(event) {
      const room = event.room?.name || "Unknown room";

      switch (event.event) {
      case "room_started":
        return `Room started: ${room}`;
      case "room_finished":
        return `Room finished: ${room}`;
      case "participant_joined": {
        const joinedParticipant = event.participant?.identity || "Unknown";
        return `${joinedParticipant} joined room: ${room}`;
      }
      case "participant_left": {
        const leftParticipant = event.participant?.identity || "Unknown";
        return `${leftParticipant} left room: ${room}`;
      }
      case "track_published": {
        const publishedBy = event.participant?.identity || "Unknown";
        const trackType = event.track?.type || "track";
        return `${publishedBy} published ${trackType} in room: ${room}`;
      }
      case "track_unpublished": {
        const unpublishedBy = event.participant?.identity || "Unknown";
        const unpublishedTrackType = event.track?.type || "track";
        return `${unpublishedBy} unpublished ${unpublishedTrackType} in room: ${room}`;
      }
      case "egress_started": {
        const egressId = event.egressInfo?.egressId || "Unknown";
        return `Egress started (${egressId}) in room: ${room}`;
      }
      case "egress_updated": {
        const egressId = event.egressInfo?.egressId || "Unknown";
        return `Egress updated (${egressId}) in room: ${room}`;
      }
      case "egress_ended": {
        const egressId = event.egressInfo?.egressId || "Unknown";
        return `Egress ended (${egressId}) in room: ${room}`;
      }
      case "ingress_started": {
        const ingressId = event.ingressInfo?.ingressId || "Unknown";
        return `Ingress started (${ingressId}) in room: ${room}`;
      }
      case "ingress_ended": {
        const ingressId = event.ingressInfo?.ingressId || "Unknown";
        return `Ingress ended (${ingressId}) in room: ${room}`;
      }
      default:
        return `${event.event} in room: ${room}`;
      }
    },
  },
  async run({
    headers, bodyRaw,
  }) {
    if (!headers.authorization) {
      throw new Error("Missing Authorization header");
    }

    const webhookEvent = await this.app.verifyWebhook(bodyRaw, headers.authorization);

    if (this.shouldEmitEvent(webhookEvent)) {
      this.$emit(webhookEvent, {
        id: webhookEvent.id,
        summary: this.generateSummary(webhookEvent),
        ts: parseInt(webhookEvent.createdAt) * 1000,
      });
    }
  },
};
