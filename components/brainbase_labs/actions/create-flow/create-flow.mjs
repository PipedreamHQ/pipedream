import app from "../../brainbase.app.mjs";

export default {
    key: "brainbase-create-flow",
    name: "Create Flow",
    description: "Create a new flow for a worker. [See the documentation](https://docs.brainbase.com)",
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
        name: {
            type: "string",
            label: "Name",
            description: "The name of the flow",
        },
        code: {
            type: "string",
            label: "Code",
            description: "The flow code/definition",
        },
        label: {
            type: "string",
            label: "Label",
            description: "Optional label for the flow",
            optional: true,
        },
        variables: {
            type: "string",
            label: "Variables",
            description: "Flow variables (optional)",
            optional: true,
        },
        validate: {
            type: "boolean",
            label: "Validate",
            description: "Whether to validate the flow",
            optional: true,
        },
    },
    async run({ $ }) {
        const data = {
            name: this.name,
            code: this.code,
        };

        if (this.label) data.label = this.label;
        if (this.variables) data.variables = this.variables;
        if (this.validate !== undefined) data.validate = this.validate;

        const response = await this.app.createFlow({
            $,
            workerId: this.workerId,
            data,
        });

        $.export("$summary", `Successfully created flow "${this.name}"`);
        return response;
    },
};

