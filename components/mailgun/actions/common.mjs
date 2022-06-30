import mailgun from "../mailgun.app.mjs";

export default {
  props: {
    mailgun,
    haltOnError: {
      propDefinition: [
        mailgun,
        "haltOnError",
      ],
    },
  },
  methods: {
    async withErrorHandler(action, opts) {
      try {
        return await action(opts);
      } catch (error) {
        if (this.haltOnError) {
          console.log(error);
          throw error;
        }
        return error;
      }
    },
  },
};
