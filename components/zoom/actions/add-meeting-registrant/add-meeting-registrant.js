const { axios } = require("@pipedreamhq/platform");
const zoom = require("../../zoom.app");

module.exports = {
    key: "zoom-create-meeting-registrant",
    name: "Create Meeting Registrant",
    description: "Creates a meeting registrant / `Only available for paid users`",
    type: "action",
    version: "0.0.1",
    props: {
        zoom,
        meetingId: {
            label: "Meeting ID",
            type: "integer",
            description: "The meeting ID",
            optional: false,
            default: 0,
            // @todo use and async options to pull meeting list
        },
        ocurrenceIds: {
            label: "Ocurrence IDs",
            type: "string",
            description: "Ocurrence IDs, multiple meeting ID values separated by comma. Example: '109201...,12819829...,383738..'",
            optional: true,
            default: "",
            // @todo use and async options to pull occurrenceIds: Get this value from the meeting get API.
        },
        registrantEmail: {
            label: "Email",
            type: "string",
            description: "Registrant's Email",
            optional: false,
            default: "",
        },
        registrantFirstName: {
            label: "First Name",
            type: "string",
            description: "Registrant's First Name",
            optional: false,
            default: "",
        },
        registrantLastName: {
            label: "Last Name",
            type: "string",
            description: "Registrant's Last Name",
            optional: true,
            default: "",
        },
        registrantAddress: {
            label: "Address",
            type: "string",
            description: "Registrant's Address",
            optional: true,
            default: "",
        },
        registrantCity: {
            label: "City",
            type: "string",
            description: "Registrant's City",
            optional: true,
            default: "",
        },
        registrantCountry: {
            label: "Country",
            type: "string",
            description: `Registrant's country. 
            The value of this field must be in two-letter abbreviated form and 
            must match the ID field provided in the [Countries](https://marketplace.zoom.us/docs/api-reference/other-references/abbreviation-lists#countries) table.`,
            optional: true,
            default: "",
        },
        registrantZip: {
            label: "Zip Code",
            type: "string",
            description: "Registrant's Zip/Postal Code",
            optional: true,
            default: "",
        },
        registrantState: {
            label: "State",
            type: "string",
            description: "Registrant's State/Province",
            optional: true,
            default: "",
        },
        registrantPhone: {
            label: "Phone",
            type: "string",
            description: "Registrant's Phone",
            optional: true,
            default: "",
        },
        registrantIndustry: {
            label: "Industry",
            type: "string",
            description: "Registrant's Industry",
            optional: true,
            default: "",
        },
        registrantOrg: {
            label: "Organization",
            type: "string",
            description: "Registrant's Organization",
            optional: true,
            default: "",
        },
        registrantJobTitle: {
            label: "Job Title",
            type: "string",
            description: "Registrant's Job Title",
            optional: true,
            default: "",
        },
        registrantPurchasingTimeFrame: {
            label: "Purchasing Time Frame",
            type: "string",
            description: "This field can be included to gauge interest of meeting attendees towards buying your product or service.",
            optional: true,
            default: "",
            options: [
                "Within a month",
                "1-3 months",
                "4-6 months",
                "More than 6 months",
                "No timeframe",
            ],
        },
        registrantRoleInPurchaseProcess: {
            label: "Role in Purchase Process",
            type: "string",
            description: "Role in Purchase Process",
            optional: true,
            default: "",
            options: [
                "Decision Maker",
                "Evaluator/Recommender",
                "Influencer",
                "Not involved",
            ],
        },
        registrantNoOfEmployees: {
            label: "Number of Employees",
            type: "string",
            description: "Number of Employees",
            optional: true,
            default: "",
            options: [
                "1-20",
                "21-50",
                "51-100",
                "101-500",
                "501-1,000",
                "1,001-5,000",
                "5,001-10,000",
                "More than 10,000",
            ]
        },
        registrantComments: {
            label: "Comments",
            type: "string",
            description: "Allows the registrant to provide any questions or comments that they might have.",
            optional: true,
            default: "",
        },
        registrantCustomQuestions: {
            label: "Custom Questions",
            type: "any",
            description: `Custom questions.
            this field expects JSON input.  
            Example: 
            '[{"title": "the custom question", "value":"response value, has a limit of 128 characters."}]' `,
            optional: true,
            default: "",
        },
        registrantLanguage: {
            label: "Language",
            type: "string",
            description: "Registrant language preference for confirmation emails.",
            optional: true,
            default: "",
            options: [
                "en-US",
                "de-DE",
                "es-ES",
                "fr-FR",
                "jp-JP",
                "pt-PT",
                "ru-RU",
                "zh-CN",
                "zh-TW",
                "ko-KO",
                "it-IT",
                "vi-VN",
            ],
        },
        registrantAutoApprove: {
            label: "Auto Approve",
            type: "boolean",
            description: "Auto approve registrant.",
            optional: true,
            default: true,
        },
    },
    async run() {

        const requestData = this.zoom.filterEmptyRequestFields({
            email: this.registrantEmail,
            first_name: this.registrantFirstName,
            last_name: this.registrantLastName,
            address: this.registrantAddress,
            city: this.registrantCity,
            country: this.registrantCountry,
            zip: this.registrantZip,
            state: this.registrantState,
            phone: this.registrantPhone,
            industry: this.registrantIndustry,
            org: this.registrantOrg,
            job_title: this.registrantJobTitle,
            purchasing_time_frame: this.registrantPurchasingTimeFrame,
            role_in_purchase_process: this.registrantRoleInPurchaseProcess,
            no_of_employees: this.registrantNoOfEmployees,
            comments: this.registrantComments,
            custom_questions: this.registrantCustomQuestions,
            language: this.registrantLanguage,
            auto_approve: this.registrantAutoApprove,
        });
        
        const queryParams = (this.ocurrenceIds !== "") ? `?ocurrence_ids=${this.ocurrenceIds}` : ""; 

        const requestConfig = this.zoom.makeRequestConfig(
            `/meetings/${this.meetingId}/registrants${queryParams}`,
            "post",
            requestData,
        );

        try {
            let response = await axios(this, requestConfig);
            return response;
        } catch (error) {
            return error.response.data;
        }

    }
}