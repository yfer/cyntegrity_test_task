import { HTTP } from "./http-common";

/* globals localStorage */

export default {
  login(username, password, cb) {
    cb = arguments[arguments.length - 1];
    if (localStorage.token) {
      if (cb) cb(true);
      this.onChange(true);
      return;
    }
    loginRequest(username, password, res => {
      if (res.authenticated) {
        localStorage.token = res.token;
        if (cb) cb(true);
        this.onChange(true);
      } else {
        if (cb) cb(false);
        this.onChange(false);
      }
    });
  },

  getToken() {
    return localStorage.token;
  },

  logout(cb) {
    delete localStorage.token;
    if (cb) cb();
    this.onChange(false);
  },

  loggedIn() {
    return !!localStorage.token;
  },

  onChange() {}
};

function loginRequest(username, password, cb) {
  HTTP()
    .post("auth/login", {
      username: username,
      password: password
    })
    .then(resp => {
      cb({
        authenticated: true,
        token: resp.data.token
      });
    })
    .catch(() => {
      cb({
        authenticated: false
      });
    });
}
