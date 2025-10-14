import app from "../../brainbase.app.mjs";

export default {
    key: "brainbase-get-integration",
    name: "Get Integration",
    description: "Get a specific integration by ID. [See the documentation](https://docs.brainbase.com)",
    version: "0.0.1",
    type: "action",
    props: {
        app,
        integrationId: {
            propDefinition: [
                app,
                "integrationId",
            ],
        },
    },
    async run({ $ }) {
        const response = await this.app.getIntegration({
            $,
            integrationId: this.integrationId,
        });

        $.export("$summary", `Successfully retrieved integration with ID ${this.integrationId}`);
        return response;
    },
};

