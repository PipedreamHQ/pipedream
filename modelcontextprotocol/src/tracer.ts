import tracer from "dd-trace"
if (process.env.DATADOG_INIT) {
  tracer.init({
    profiling: true,
    runtimeMetrics: true,
  })
  tracer.use("express")
}
export default tracer
