import app from "../../brainbase.app.mjs";

export default {
    key: "brainbase-delete-worker",
    name: "Delete Worker",
    description: "Delete a worker. [See the documentation](https://docs.brainbase.com)",
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
        const response = await this.app.deleteWorker({
            $,
            workerId: this.workerId,
        });

        $.export("$summary", `Successfully deleted worker with ID ${this.workerId}`);
        return response;
    },
};

