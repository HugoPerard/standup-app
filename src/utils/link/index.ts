export const formatExternalUrl = (url) =>
  /^(?:f|ht)tps?:\/\//.test(url) ? url : `//${url}`;
