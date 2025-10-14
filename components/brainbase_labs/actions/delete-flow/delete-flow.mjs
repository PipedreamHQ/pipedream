import app from "../../brainbase.app.mjs";

export default {
    key: "brainbase-delete-flow",
    name: "Delete Flow",
    description: "Delete a flow. [See the documentation](https://docs.brainbase.com)",
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
        const response = await this.app.deleteFlow({
            $,
            workerId: this.workerId,
            flowId: this.flowId,
        });

        $.export("$summary", `Successfully deleted flow with ID ${this.flowId}`);
        return response;
    },
};

