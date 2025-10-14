import app from "../../brainbase.app.mjs";

export default {
    key: "brainbase-get-flow",
    name: "Get Flow",
    description: "Get a single flow by ID. [See the documentation](https://docs.brainbase.com)",
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
        flowId: {
            propDefinition: [
                app,
                "flowId",
                (c) => ({
                    workerId: c.workerId,
                }),
            ],
        },
    },
    async run({ $ }) {
        const response = await this.app.getFlow({
            $,
            workerId: this.workerId,
            flowId: this.flowId,
        });

        $.export("$summary", `Successfully retrieved flow with ID ${this.flowId}`);
        return response;
    },
};

