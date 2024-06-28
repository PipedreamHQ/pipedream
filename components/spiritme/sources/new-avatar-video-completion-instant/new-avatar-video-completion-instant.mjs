import spiritme from "../../spiritme.app.mjs";

export default {
  key: "spiritme-new-avatar-video-completion-instant",
  name: "New Avatar Video Completion",
  description: "Emits a new event when an avatar video completes rendering.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    spiritme,
    avatarId: {
      propDefinition: [
        spiritme,
        "avatarId",
      ],
    },
    systemStatusNotifications: {
      propDefinition: [
        spiritme,
        "systemStatusNotifications",
        (c) => ({
          avatarId: c.avatarId,
        }),
      ],
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const { avatarId } = this;
      const videoId = await this.spiritme.generateVideo({
        avatarId,
      });
      this.db.set("videoId", videoId);
    },
  },
  async run(event) {
    const {
      headers, body,
    } = event;
    const videoId = this.db.get("videoId");

    // Validate the incoming webhook request
    if (headers["Spiritme-Signature"] !== this.spiritme.$auth.api_key) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    // Check if the webhook is for the correct avatar and if the video is completed
    if (body.data.avatar !== this.avatarId || body.data.status !== "success") {
      return;
    }

    const videoStatus = await this.spiritme.getVideoStatus(videoId);
    if (videoStatus === "success") {
      this.$emit(body.data, {
        id: body.data.id,
        summary: `Avatar video ${body.data.id} has status ${body.data.status}`,
        ts: Date.parse(body.data.created_at),
      });
    }
  },
};
