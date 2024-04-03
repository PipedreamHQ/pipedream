export async function pollTaskStatus($, ctx, taskKey) {
  let response = {};
  const timer = (ms) => new Promise((res) => setTimeout(res, ms));
  while (!response.isSucceeded) {
    response = await ctx.clickhelp.getTaskStatus({
      $,
      taskKey,
    });
    await timer(3000);
  }
  return response;
}
