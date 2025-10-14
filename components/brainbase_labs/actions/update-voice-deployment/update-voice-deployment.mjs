import app from "../../brainbase.app.mjs";

export default {
    key: "brainbase-update-voice-deployment",
    name: "Update Voice Deployment",
    description: "Update an existing voice deployment. [See the documentation](https://docs.brainbase.com)",
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
        deploymentId: {
            propDefinition: [
                app,
                "deploymentId",
                (c) => ({
                    workerId: c.workerId,
                }),
            ],
        },
        name: {
            type: "string",
            label: "Name",
            description: "Deployment name",
            optional: true,
        },
        phoneNumber: {
            type: "string",
            label: "Phone Number",
            description: "Phone number for deployment",
            optional: true,
        },
        flowId: {
            propDefinition: [
                app,
                "flowId",
                (c) => ({
                    workerId: c.workerId,
                }),
            ],
            optional: true,
        },
        externalConfig: {
            type: "object",
            label: "External Config",
            description: "External configuration object",
            optional: true,
        },
        enableVoiceSentiment: {
            type: "boolean",
            label: "Enable Voice Sentiment",
            description: "Enable voice sentiment analysis",
            optional: true,
        },
        extractions: {
            type: "object",
            label: "Extractions",
            description: "Extractions configuration",
            optional: true,
        },
        customWebhooks: {
            type: "string[]",
            label: "Custom Webhooks",
            description: "Custom webhooks array",
            optional: true,
        },
        successCriteria: {
            type: "string[]",
            label: "Success Criteria",
            description: "Success criteria array",
            optional: true,
        },
    },
    async run({ $ }) {
        const data = {};

        if (this.name) data.name = this.name;
        if (this.phoneNumber) data.phoneNumber = this.phoneNumber;
        if (this.flowId) data.flowId = this.flowId;
        if (this.externalConfig) data.externalConfig = this.externalConfig;
        if (this.enableVoiceSentiment !== undefined) data.enableVoiceSentiment = this.enableVoiceSentiment;
        if (this.extractions) data.extractions = this.extractions;
        if (this.customWebhooks) data.customWebhooks = this.customWebhooks;
        if (this.successCriteria) data.successCriteria = this.successCriteria;

        const response = await this.app.updateVoiceDeployment({
            $,
            workerId: this.workerId,
            deploymentId: this.deploymentId,
            data,
        });

        $.export("$summary", `Successfully updated voice deployment with ID ${this.deploymentId}`);
        return response;
    },
};

