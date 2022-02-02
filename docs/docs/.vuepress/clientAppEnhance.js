import { defineClientAppEnhance } from "@vuepress/client";
import workflow from "./theme/components/svgs/workflow.vue";
import trigger from "./theme/components/svgs/trigger.vue";
import integration from "./theme/components/svgs/integration.vue";
import step from "./theme/components/svgs/step.vue";
import code from "./theme/components/svgs/code.vue";

export default defineClientAppEnhance(({ app, router, siteData }) => {
  // Your enhance code
  app.component("workflow-icon", workflow);
  app.component("trigger-icon", trigger);
  app.component("step-icon", step);
  app.component("integration-icon", integration);
  app.component("code-icon", code);
});
