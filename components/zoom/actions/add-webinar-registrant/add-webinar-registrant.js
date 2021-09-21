const { axios } = require("@pipedreamhq/platform");
const zoom = require("../../zoom.app");

module.exports = {
    key: "zoom-add-webinar-registrant",
    name: "Add webinar registrant",
    description: "Adds a Zoom webinar registrant / `Pro or higher plan with a Webinar Add-on`",
    type: "action",
    version: "0.0.1",
    props: {
        zoom,
        webinarId: {
            label: "WebinarId",
            type: "integer",
            description: "The webinar ID",
            optional: false,
            default: ""
            // @todo use and async options to pull webinarID  
        },
        occurrenceIds: {
            label: "Occurrence ids",
            type: "string",
            description: "Ocurrence IDs, multiple webinar ID values separated by comma. Example: '109201...,12819829...,383738..'",
            optional: true,
            default: ""
            // @todo use and async options to pull occurrenceIds: Get this value from the webinar get API.
        },
        email: {
            label: "Email",
            type: "string",
            description: "A valid email address of the registrant.",
            optional: false,
            default: ""
        },
        firstName: {
            label: "First name",
            type: "string",
            description: "Registrant's first name.",
            optional: false,
            default: ""
        },
        lastName: {
            label: "Last name",
            type: "string",
            description: "Registrant's last name.",
            optional: true,
            default: ""
        },
        address: {
            label: "Address",
            type: "string",
            description: "Registrant's address.",
            optional: true,
            default: ""
        },
        city: {
            label: "City",
            type: "string",
            description: "Registrant's city.",
            optional: true,
            default: ""
        },
        country: {
            label: "Country",
            type: "string",
            description: "Registrant's country. The value of this field must be in two-letter abbreviated form and must match the ID field provided in the [Countries](https://marketplace.zoom.us/docs/api-reference/other-references/abbreviation-lists#countries) table.",
            optional: true,
            default: ""
        },
        zip: {
            label: "Zip",
            type: "string",
            description: "Registrant's Zip/Postal Code.",
            optional: true,
            default: ""
        },
        state: {
            label: "State",
            type: "string",
            description: "Registrant's State/Province.",
            optional: true,
            default: ""
        },
        phone: {
            label: "Phone",
            type: "string",
            description: "Registrant's Phone number.",
            optional: true,
            default: ""
        },
        industry: {
            label: "Industry",
            type: "string",
            description: "Registrant's Industry.",
            optional: true,
            default: ""
        },
        org: {
            label: "Org",
            type: "string",
            description: "Registrant's Organization.",
            optional: true,
            default: ""
        },
        jobTitle: {
            label: "Job title",
            type: "string",
            description: "Registrant's job title.",
            optional: true,
            default: ""
        },
        purchasingTimeFrame: {
            label: "Purchasing time frame",
            type: "string",
            description: "This field can be included to gauge interest of webinar attendees towards buying your product or service.",
            options : [
                "Within a month",
                "1-3 months",
                "4-6 months",
                "More than 6 months",
                "No timeframe",
            ],
            optional: true,
            default: ""
        },
        roleInPurchaseProcess: {
            label: "Role in purchase process",
            type: "string",
            description: "Role in Purchase Process.",
            options : [
                "Decision Maker",
                "Evaluator/Recommender",
                "Influencer",
                "Not involved",
            ],
            optional: true,
            default: ""
        },
        noOfEmployees: {
            label: "No of employees",
            type: "string",
            description: "Number of Employees:",
            options : [
                "1-20",
                "21-50",
                "51-100",
                "101-500",
                "500-1,000",
                "1,001-5,000",
                "5,001-10,000",
                "More than 10,000",
            ],
            optional: true,
            default: ""
        },
        comments: {
            label: "Comments",
            type: "string",
            description: "A field that allows registrants to provide any questions or comments that they might have.",
            optional: true,
            default: ""
        },
        customQuestions: {
            label: "Custom questions",
            type: "any",
            description: `Custom questions.
            this field expects JSON input.  
            Example: 
            '[{"title": "the custom question", "value":"response value, has a limit of 128 characters."}]' `,
            optional: true,
            default: ""
        }
    },
    async run() {
        const requestData = this.zoom.filterEmptyRequestFields({
            email: this.email,
            first_name: this.firstName,
            last_name: this.lastName,
            address: this.address,
            city: this.city,
            country: this.country,
            zip: this.zip,
            state: this.state,
            phone: this.phone,
            industry: this.industry,
            org: this.org,
            job_title: this.jobTitle,
            purchasing_time_frame: this.purchasingTimeFrame,
            role_in_purchase_process: this.roleInPurchaseProcess,
            no_of_employees: this.noOfEmployees,
            comments: this.comments,
            custom_questions: this.customQuestions
        });

        const queryParams = (this.ocurrenceIds !== "") ? `?ocurrence_ids=${this.ocurrenceIds}` : ""; 

        const requestConfig = this.zoom.makeRequestConfig(
            `/webinars/${this.webinarId}/registrants${queryParams}`,
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