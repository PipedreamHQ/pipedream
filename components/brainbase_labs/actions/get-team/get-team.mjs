import app from "../../brainbase.app.mjs";

export default {
    key: "brainbase-get-team",
    name: "Get Team",
    description: "Get the team associated with the provided API key. [See the documentation](https://docs.brainbase.com)",
    version: "0.0.1",
    type: "action",
    props: {
        app,
        includeIntegrations: {
            type: "boolean",
            label: "Include Integrations",
            description: "Set to true to also include integrations in the response",
            optional: true,
        },
    },
    async run({ $ }) {
        const params = {};
        if (this.includeIntegrations !== undefined) {
            params.includeIntegrations = this.includeIntegrations;
        }

        const response = await this.app.getTeam({
            $,
            params,
        });

        $.export("$summary", "Successfully retrieved team information");
        return response;
    },
};

