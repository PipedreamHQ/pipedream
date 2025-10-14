import app from "../../brainbase.app.mjs";

export default {
    key: "brainbase-get-phone-numbers",
    name: "Get Phone Numbers",
    description: "Get all registered phone numbers for the team, optionally filtered by integration id. [See the documentation](https://docs.brainbase.com)",
    version: "0.0.1",
    type: "action",
    props: {
        app,
        integrationId: {
            propDefinition: [
                app,
                "integrationId",
            ],
            optional: true,
        },
    },
    async run({ $ }) {
        const params = {};
        if (this.integrationId) {
            params.integrationId = this.integrationId;
        }

        const response = await this.app.getPhoneNumbers({
            $,
            params,
        });

        $.export("$summary", `Successfully retrieved ${response.data?.length || 0} phone number(s)`);
        return response;
    },
};

