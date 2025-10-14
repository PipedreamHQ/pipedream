import app from "../../brainbase.app.mjs";

export default {
    key: "brainbase-delete-integration",
    name: "Delete Integration",
    description: "Delete an existing Twilio integration. [See the documentation](https://docs.brainbase.com)",
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
        const response = await this.app.deleteIntegration({
            $,
            integrationId: this.integrationId,
        });

        $.export("$summary", `Successfully deleted integration with ID ${this.integrationId}`);
        return response;
    },
};

