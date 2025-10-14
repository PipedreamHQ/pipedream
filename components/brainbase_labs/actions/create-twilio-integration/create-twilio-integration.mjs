import app from "../../brainbase.app.mjs";

export default {
    key: "brainbase-create-twilio-integration",
    name: "Create Twilio Integration",
    description: "Create a new Twilio integration for the authenticated team. [See the documentation](https://docs.brainbase.com)",
    version: "0.0.1",
    type: "action",
    props: {
        app,
        accountSid: {
            type: "string",
            label: "Account SID",
            description: "Twilio account SID",
        },
        authToken: {
            type: "string",
            label: "Auth Token",
            description: "Twilio auth token (will be encrypted before being stored)",
            secret: true,
        },
    },
    async run({ $ }) {
        const response = await this.app.createTwilioIntegration({
            $,
            data: {
                accountSid: this.accountSid,
                authToken: this.authToken,
            },
        });

        $.export("$summary", "Successfully created Twilio integration");
        return response;
    },
};

