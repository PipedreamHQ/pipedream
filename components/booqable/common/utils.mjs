async function iterate(iterations) {
  const items = [];
  for await (const item of iterations) {
    items.push(item);
  }
  return items;
}

export default {
  iterate,
};
