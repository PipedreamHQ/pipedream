import frameio from "../../frameio.app.mjs";

export default {
  key: "frameio-new-project-instant",
  name: "New Project Instant",
  description: "Emit new event when a new project is created.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    frameio,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    projectId: {
      propDefinition: [
        frameio,
        "projectId",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Fetch the 50 most recent projects to backfill events on first run
      const projects = await this.frameio.getProjects({
        pageSize: 50,
      });
      projects.forEach((project) => {
        this.$emit(project, {
          id: project.id,
          summary: `New project: ${project.name}`,
          ts: Date.parse(project.inserted_at),
        });
      });
    },
    async activate() {
      // Placeholder for webhook subscription logic if available
    },
    async deactivate() {
      // Placeholder for webhook deletion logic if available
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    // Perform necessary validation of incoming webhook (if applicable)
    if (!headers["x-frameio-signature"]) {
      this.http.respond({
        status: 401,
        body: "Unauthorized: No Frame.io signature header present",
      });
      return;
    }

    // Assuming the body contains the project information directly
    if (body && body.id) {
      this.$emit(body, {
        id: body.id,
        summary: `New project: ${body.name}`,
        ts: Date.parse(body.inserted_at),
      });
    } else {
      this.http.respond({
        status: 400,
        body: "Bad Request: Missing project ID",
      });
    }
  },
};
