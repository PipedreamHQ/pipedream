import "inter-ui/inter-hinted.css";
import VueGtm from "vue-gtm";

export default ({
  Vue, // the version of Vue being used in the VuePress app
  options, // the options for the root Vue instance
  router, // the router instance for the app
  siteData // site metadata
}) => {
  if (typeof window !== "undefined") {
    Vue.use(VueGtm, {
      id: "GTM-KBDH3DB",
      enabled: true,
      debug: false,
      vueRouter: router
    });
  }
};
