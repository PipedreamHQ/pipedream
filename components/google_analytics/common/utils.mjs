function monthAgo() {
  const monthAgo = new Date();
  monthAgo.setMonth(monthAgo.getMonth() - 1);
  return monthAgo.toISOString().split("T")[0];
}

export default {
  monthAgo,
};
