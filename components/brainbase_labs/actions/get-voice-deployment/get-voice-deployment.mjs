import app from "../../brainbase.app.mjs";

export default {
    key: "brainbase-get-voice-deployment",
    name: "Get Voice Deployment",
    description: "Get a single voice deployment by ID. [See the documentation](https://docs.brainbase.com)",
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
        },
    },
    async run({ $ }) {
        const response = await this.app.getVoiceDeployment({
            $,
            workerId: this.workerId,
            deploymentId: this.deploymentId,
        });

        $.export("$summary", `Successfully retrieved voice deployment with ID ${this.deploymentId}`);
        return response;
    },
};

