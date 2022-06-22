function monthAgo() {
  const monthAgo = new Date();
  monthAgo.setMonth(monthAgo.getMonth() - 1);
  return monthAgo;
}

export {
  monthAgo,
};
