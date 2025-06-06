import { atlasProps } from "../../common/atlas-props.mjs";
import { atlasMixin } from "../../common/atlas-base.mjs";

export default {
  key: "atlas-new-job-posted",
  name: "New Job Posted",
  description: "Emit new event when a job is posted on ATLAS",
  version: "0.0.1",
  type: "source",
  props: {
    ...atlasProps,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // Check every 15 minutes
      },
    },
  },
  ...atlasMixin,
  dedupe: "unique",
  async run() {
    try {
      // Validate authentication configuration
      this.validateAuth();

      const atlas = this.createAtlasClient();

      // Get the last check timestamp
      const lastCheck = this.db.get("lastCheck") || new Date(Date.now() - 24 * 60 * 60 * 1000); // Default: 24h ago
      
      // Get recent jobs
      const response = await atlas.getJobs({
        limit: 100,
        // Add date filter if API supports it
        created_after: lastCheck,
      });

      const jobs = response.data || response;
      
      if (Array.isArray(jobs)) {
        // Emit each new job as separate event
        jobs.forEach(job => {
          this.$emit(job, {
            id: job.id,
            summary: `New job posted: ${job.title || job.name || 'Untitled Job'}`,
            ts: job.created_at ? new Date(job.created_at).getTime() : Date.now(),
          });
        });

        // Update last check timestamp
        this.db.set("lastCheck", new Date().toISOString());
        
        const authMethod = this.apiKey ? "API Key" : "Username/Password";
        console.log(`Processed ${jobs.length} jobs using ${authMethod}`);
      }
      
    } catch (error) {
      this.handleAtlasError(error, "Check for new jobs");
    }
  },
};