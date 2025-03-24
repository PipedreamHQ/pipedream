async function iterate(iterations) {
  const items = [];
  for await (const item of iterations) {
    items.push(item);
  }
  return items;
}

function cleanObject(o) {
  for (var k in o || {}) {
    if (typeof o[k] === "undefined") {
      delete o[k];
    }
  }
  return o;
}

export default {
  iterate,
  cleanObject,
};
