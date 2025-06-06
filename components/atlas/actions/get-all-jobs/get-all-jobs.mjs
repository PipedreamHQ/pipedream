import { atlasProps, jobProps } from "../../common/atlas-props.mjs";
import { atlasMixin } from "../../common/atlas-base.mjs";

export default {
  key: "atlas-get-all-jobs",
  name: "Get All Job Listings",
  description: "Retrieve all job listings from ATLAS",
  version: "0.0.15",
  type: "action",
  props: {
    ...atlasProps,
    ...jobProps,
  },
  ...atlasMixin,
  async run({ $ }) {
    try {
      // Validate authentication configuration
      this.validateAuth();

      // Create ATLAS client
      const atlas = this.createAtlasClient();

      // Prepare parameters
      const params = this.cleanParams({
        limit: this.limit,
        offset: this.offset,
        status: this.status,
      });

      // Make API request
      const response = await atlas.getJobs(params);
      
      // Process response
      const jobs = response.data || response;
      const jobCount = Array.isArray(jobs) ? jobs.length : 0;
      
      const authMethod = this.apiKey ? "API Key" : "Username/Password";
      $.export("$summary", `Successfully retrieved ${jobCount} job listing(s) using ${authMethod}`);
      
      return {
        success: true,
        count: jobCount,
        jobs: jobs,
        params: params,
        authMethod: authMethod,
      };
      
    } catch (error) {
      this.handleAtlasError(error, "Get jobs");
    }
  },
};