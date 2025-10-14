import app from "../../brainbase.app.mjs";

export default {
    key: "brainbase-delete-phone-number",
    name: "Delete Phone Number",
    description: "Delete a registered phone number for the team. [See the documentation](https://docs.brainbase.com)",
    version: "0.0.1",
    type: "action",
    props: {
        app,
        phoneNumberId: {
            propDefinition: [
                app,
                "phoneNumberId",
            ],
        },
    },
    async run({ $ }) {
        const response = await this.app.deletePhoneNumber({
            $,
            phoneNumberId: this.phoneNumberId,
        });

        $.export("$summary", `Successfully deleted phone number with ID ${this.phoneNumberId}`);
        return response;
    },
};

