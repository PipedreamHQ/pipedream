import app from "../../brainbase.app.mjs";

export default {
    key: "brainbase-list-voice-deployments",
    name: "List Voice Deployments",
    description: "Get all voice deployments for a worker. [See the documentation](https://docs.brainbase.com)",
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
    },
    async run({ $ }) {
        const response = await this.app.listVoiceDeployments({
            $,
            workerId: this.workerId,
        });

        $.export("$summary", `Successfully retrieved ${response.data?.length || 0} voice deployment(s)`);
        return response;
    },
};

