function capitalizeFirstLetter(str) {
  if (!str || typeof str !== "string") return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getUserId(req) {
  return req.user.userId;
}
function getParamId(req) {
  return req.params.id;
}

export { capitalizeFirstLetter, getUserId, getParamId };
