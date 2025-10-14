import app from "../../brainbase.app.mjs";

export default {
    key: "brainbase-update-flow",
    name: "Update Flow",
    description: "Update an existing flow. [See the documentation](https://docs.brainbase.com)",
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
        variables: {
            type: "string",
            label: "Variables",
            description: "Flow variables",
        },
        validate: {
            type: "boolean",
            label: "Validate",
            description: "Whether to validate the flow",
        },
        label: {
            type: "string",
            label: "Label",
            description: "Optional label for the flow",
            optional: true,
        },
    },
    async run({ $ }) {
        const data = {
            name: this.name,
            code: this.code,
            variables: this.variables,
            validate: this.validate,
        };

        if (this.label) data.label = this.label;

        const response = await this.app.updateFlow({
            $,
            workerId: this.workerId,
            flowId: this.flowId,
            data,
        });

        $.export("$summary", `Successfully updated flow "${this.name}"`);
        return response;
    },
};

