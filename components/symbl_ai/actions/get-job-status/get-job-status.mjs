import symblAIApp from "../../symbl_ai.app.mjs";

export default {
    key: "symbl_ai-get-job-status",
    name: "Get Job Status",
    description: "Get the status of an Async job request",
    version: "0.0.22",
    type: "action",
    props: {
        symblAIApp,
        jobId: {
            type: "string",
            label: "Job Id",
            description: "The Id of the job request",
            optional: false,
        },
    },
    async run({ $ }) {
        try {
            const response = 
              await this.symblAIApp.getJobStatus(this.jobId);
              $.export("$summary", `Job status: ${response.status}`);
              return response;
        } catch (error) {
            console.log("Error: ", error);
            $.export("$summary", `Failed to retrieve job status`);
        }  
    },
}
