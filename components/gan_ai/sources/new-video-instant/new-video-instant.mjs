import ganAi from "../../gan_ai.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "gan_ai-new-video-instant",
  name: "New Video Instant",
  description: "Emit new event when a new video is created. [See the documentation](https://docs.gan.ai/create-video/create-videos)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    ganAi,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    projectId: {
      propDefinition: [
        ganAi,
        "projectId",
        async (options, { prevContext }) => {
          let { page } = options;
          if (!page) page = 1;
          const { data } = await axios(this, {
            url: `${this.ganAi._baseUrl()}/projects/v2?page=${page}`,
            headers: {
              Authorization: `Bearer ${this.ganAi.$auth.oauth_access_token}`,
            },
          });
          return {
            options: data.map((project) => ({
              label: project.title,
              value: project.project_id,
            })),
            context: {
              page: page + 1,
            },
          };
        },
      ],
    },
    tagsAndValues: {
      propDefinition: [
        ganAi,
        "tagsAndValues",
      ],
    },
    queryset: {
      propDefinition: [
        ganAi,
        "queryset",
      ],
    },
  },
  hooks: {
    async deploy() {
      const { data: projects } = await this.ganAi.getProjects({
        page: 1,
      });
      const videos = projects.slice(0, 50);
      for (const video of videos) {
        this.$emit(video, {
          id: video.project_id,
          summary: `New video created in project ${video.title}`,
          ts: Date.parse(video.created_at),
        });
      }
    },
    async activate() {
      const webhookUrl = this.http.endpoint;
      const { projectId } = this;
      const webhookBody = {
        url: webhookUrl,
        Authorization: `Bearer ${this.ganAi.$auth.oauth_access_token}`,
      };

      const response = await this.ganAi._makeRequest({
        method: "POST",
        path: `/projects/${projectId}/webhook`,
        headers: {
          "Content-Type": "application/json",
        },
        data: webhookBody,
      });

      this.db.set("webhookId", response.data.inference_id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await this.ganAi._makeRequest({
          method: "DELETE",
          path: `/projects/${projectId}/webhook/${webhookId}`,
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            url: this.http.endpoint,
            Authorization: `Bearer ${this.ganAi.$auth.oauth_access_token}`,
          },
        });
      }
    },
  },
  async run(event) {
    const {
      projectId, tagsAndValues, queryset,
    } = this;

    const response = await this.ganAi.createVideosBulk({
      projectId,
      tagsAndValues,
      queryset,
    });

    response.data.forEach((video) => {
      this.$emit(video, {
        id: video.unique_id,
        summary: `New video created with unique ID: ${video.unique_id}`,
        ts: Date.parse(video.created_at),
      });
    });
  },
};
