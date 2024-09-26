import constants from "./constants.mjs";

async function streamIterator(stream) {
  const resources = [];
  for await (const resource of stream) {
    resources.push(resource);
  }
  return resources;
}

function strToObj(str) {
  var obj = {};
  if (str && typeof str === "string") {
    var objStr = str.match(/\{(.)+\}/g);
    eval("obj =" + objStr);
  }
  return obj;
}

function buildVariables(endCursor, args) {
  const title = args.filter.query
    ? `title: { containsIgnoreCase: "${args.filter.query}" }`
    : "";
  const teamId = args.filter.teamId
    ? `, team: { id: { eq: "${args.filter.teamId}" } }`
    : "";
  const projectId = args.filter.projectId
    ? `, project: { id: { eq: "${args.filter.projectId}" } }`
    : "";
  const team = args.filter.team && args.filter.team.id
    ? `, team: { id: { in: ${JSON.stringify(args.filter.team.id.in)} } }`
    : "";
  const project = args.filter.project && args.filter.project.id.eq
    ? `, project: { id: { eq: "${args.filter.project.id.eq}" } }`
    : "";
  const state = args.filter.state && args.filter.state.id.eq
    ? `, state: { id: { eq: "${args.filter.state.id.eq}" } }`
    : "";
  const assigneeId = args.filter.assigneeId
    ? `, assignee: { id: { eq: "${args.filter.assigneeId}" } }`
    : "";
  const issueLabels = args.filter.issueLabels
    ? `, labels: { name: { in: ${JSON.stringify(args.filter.issueLabels)} } }`
    : "";
  let filter = `${title}${teamId}${projectId}${team}${project}${state}${assigneeId}${issueLabels}`;
  if (filter[0] === ",") {
    filter = filter.substring(2, filter.length);
  }

  const orderBy = args.orderBy
    ? `, orderBy: "${args.orderBy}"`
    : "";
  const includeArchived = args.includeArchived
    ? `, includeArchived: ${args.includeArchived}`
    : "";
  const after = endCursor
    ? `, after: "${endCursor}"`
    : "";
  return strToObj(`{ filter: { ${filter} }, first: ${constants.DEFAULT_LIMIT}${orderBy}${includeArchived}${after} }`);
}

export default {
  streamIterator,
  strToObj,
  buildVariables,
};
