import app from "../../brainbase.app.mjs";

export default {
    key: "brainbase-list-voice-deployment-logs",
    name: "List Voice Deployment Logs",
    description: "List voice deployment logs for a worker with optional filtering and pagination. [See the documentation](https://docs.brainbase.com)",
    version: "0.0.1",
    type: "action",
    props: {
        app,
        workerId: {
            propDefinition: [
                app,
                "workerId",
            ],
        },
        deploymentId: {
            propDefinition: [
                app,
                "deploymentId",
                (c) => ({
                    workerId: c.workerId,
                }),
            ],
            description: "Filter logs by deployment ID (optional)",
            optional: true,
        },
        flowId: {
            propDefinition: [
                app,
                "flowId",
                (c) => ({
                    workerId: c.workerId,
                }),
            ],
            description: "Filter logs by flow ID (optional)",
            optional: true,
        },
        page: {
            type: "integer",
            label: "Page",
            description: "Page number for pagination (default: 1, minimum: 1)",
            optional: true,
            min: 1,
            default: 1,
        },
        limit: {
            type: "integer",
            label: "Limit",
            description: "Number of items per page (default: 100, minimum: 1, maximum: 100)",
            optional: true,
            min: 1,
            max: 100,
            default: 100,
        },
    },
    async run({ $ }) {
        const params = {
            page: this.page,
            limit: this.limit,
        };

        if (this.deploymentId) params.deploymentId = this.deploymentId;
        if (this.flowId) params.flowId = this.flowId;

        const response = await this.app.listVoiceDeploymentLogs({
            $,
            workerId: this.workerId,
            params,
        });

        $.export("$summary", `Successfully retrieved ${response.data?.length || 0} log(s)`);
        return response;
    },
};

