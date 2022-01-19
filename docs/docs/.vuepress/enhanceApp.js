import VueGtm from "vue-gtm";

export default ({
  Vue, // the version of Vue being used in the VuePress app
  options, // the options for the root Vue instance
  router, // the router instance for the app
  siteData, // site metadata
}) => {
  if (typeof window !== "undefined") {
    Vue.use(VueGtm, {
      id: "GTM-KBDH3DB",
      enabled: true,
      debug: false,
      vueRouter: router,
    });
  }

  console.log(router.getRoutes());

  router.addRoutes([
    { path: "/cron", redirect: "/workflows/steps/triggers" },
    { path: "/notebook", redirect: "/workflows/steps" },
    { path: "/workflows/fork", redirect: "/workflows/copy" },
    { path: "/notebook/fork", redirect: "/workflows/copy" },
    { path: "/notebook/inspector/", redirect: "/workflows/events/inspect/" },
    { path: "/notebook/destinations/s3/", redirect: "/destinations/s3/" },
    { path: "/notebook/destinations/sse/", redirect: "/destinations/sse/" },
    {
      path: "/notebook/destinations/snowflake/",
      redirect: "/destinations/snowflake/",
    },
    { path: "/notebook/destinations/http/", redirect: "/destinations/http/" },
    { path: "/notebook/destinations/email/", redirect: "/destinations/email/" },
    { path: "/notebook/destinations/", redirect: "/destinations/" },
    { path: "/notebook/code/", redirect: "/workflows/steps/code/" },
    {
      path: "/notebook/observability/",
      redirect: "/workflows/events/inspect/",
    },
    { path: "/notebook/actions/", redirect: "/workflows/steps/actions/" },
    { path: "/notebook/sources/", redirect: "/workflows/steps/triggers/" },
    { path: "/notebook/sql/", redirect: "/destinations/triggers/" },
    { path: "/what-is-pipedream/", redirect: "/" },
    {
      path: "/docs/apps/all-apps",
      redirect: "https://pipedream.com/apps",
    },
  ]);
};
