//todo: move into proper config, so this address is not built in container
var host = window.location.hostname;
export default {
  apiurl: "http://" + host + ":81/"
};
