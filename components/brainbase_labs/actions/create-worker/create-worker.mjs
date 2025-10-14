import app from "../../brainbase.app.mjs";

export default {
    key: "brainbase-create-worker",
    name: "Create Worker",
    description: "Create a new worker for the team. [See the documentation](https://docs.brainbase.com)",
    version: "0.0.1",
    type: "action",
    props: {
        app,
        name: {
            type: "string",
            label: "Name",
            description: "The name of the worker",
        },
        description: {
            type: "string",
            label: "Description",
            description: "Worker description",
            optional: true,
        },
        status: {
            type: "string",
            label: "Status",
            description: "Worker status",
            optional: true,
            options: [
                "active",
                "inactive",
                "archived",
            ],
        },
    },
    async run({ $ }) {
        const data = {
            name: this.name,
        };

        if (this.description) data.description = this.description;
        if (this.status) data.status = this.status;

        const response = await this.app.createWorker({
            $,
            data,
        });

        $.export("$summary", `Successfully created worker "${this.name}"`);
        return response;
    },
};

