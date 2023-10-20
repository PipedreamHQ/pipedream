export default {
  methods: {
    getPersonnelName(personnel) {
      let name = personnel.user.firstName;
      if (personnel.user.lastName) {
        name += ` ${personnel.user.lastName}`;
      }
      return name;
    },
    initializeJsonProps(ctx, props) {
      for (const prop of props) {
        if (ctx[prop] && typeof ctx[prop] === "string") {
          try {
            ctx[prop] = JSON.parse(ctx[prop]);
          } catch (e) {
            // do nothing
          }
        }
      }
    },
  },
};
