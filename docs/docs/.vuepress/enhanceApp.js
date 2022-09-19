import VueGtm from "vue-gtm";

// fork from vue-router@3.0.2
// src/util/scroll.js
function getElementPosition(el) {
  const docEl = document.documentElement
  const docRect = docEl.getBoundingClientRect()
  const elRect = el.getBoundingClientRect()
  return {
    x: elRect.left - docRect.left,
    y: elRect.top - docRect.top,
  }
}

/**
 * Fix broken Vuepress scrolling to internal #links
 * 
 * @param {String} to 
 * @returns void
 */
function scrollToAnchor(to) {
  const targetAnchor = to.hash.slice(1)
  const targetElement = document.getElementById(targetAnchor) || document.querySelector(`[name='${targetAnchor}']`)

  if (targetElement) {
    return window.scrollTo({
      top: getElementPosition(targetElement).y,
      behavior: 'smooth',
    })
  } else {
    return false
  }
}

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

  // Adapted from https://github.com/vuepress/vuepress-community/blob/7feb5c514090b6901cd7d9998f4dd858e0055b7a/packages/vuepress-plugin-smooth-scroll/src/enhanceApp.ts#L21
  // With a bug fix for handling long pages
  router.options.scrollBehavior = (to, from, savedPosition) => {
    if (typeof window === "undefined") { 
      return; 
    }
    
    if (savedPosition) {
      return window.scrollTo({
        top: savedPosition.y,
        behavior: 'smooth',
      })
    } else if (to.hash) {
      if (Vue.$vuepress.$get('disableScrollBehavior')) {
        return false
      }
      const scrollResult = scrollToAnchor(to)

      if (scrollResult) {
        return scrollResult
      } else {
        window.onload = () => {
          scrollToAnchor(to)
        }
      }
    } else {
      return window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }

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
    { path: "/workflows/steps/code/", redirect: '/code/nodejs/'}
    
  ]);
};
