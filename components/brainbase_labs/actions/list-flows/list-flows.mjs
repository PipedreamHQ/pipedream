import app from "../../brainbase.app.mjs";

export default {
    key: "brainbase-list-flows",
    name: "List Flows",
    description: "Get all flows for a worker. [See the documentation](https://docs.brainbase.com)",
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
        const response = await this.app.listFlows({
            $,
            workerId: this.workerId,
        });

        $.export("$summary", `Successfully retrieved ${response.data?.length || 0} flow(s)`);
        return response;
    },
};

