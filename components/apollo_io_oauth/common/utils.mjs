async function iterate(iterations) {
  const resources = [];
  for await (const resource of iterations) {
    resources.push(resource);
  }
  return resources;
}

export default {
  iterate,
};
