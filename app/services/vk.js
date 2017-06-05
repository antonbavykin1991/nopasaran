import Ember from 'ember';
import RSVP from 'rsvp';

import config from 'nopasaran/config/environment';

const vkPromise = RSVP.defer()

export default Ember.Service.extend({
  init () {
    const queryParams = this.getQueryParams()
    this.set('queryParams', queryParams)
    this.set('vkIsLoaded', vkPromise.promise);
  },

  profileInfo: null,

  isDev: Ember.computed(function () {
    return config.environment === 'development';
  }),


  initVK () {
    if (this.get('isDev')) {
      return RSVP.Promise.resolve()
    }

    return new RSVP.Promise((resolve, reject) => {
      window.VK.init(function (data) {
        vkPromise.resolve()
        resolve()
      }, (error) => {
        vkPromise.reject()
        reject(error)
      })
    })
    .then(() => this._getCurrentUser())

  },

  getQueryParams() {
    const queryParams = {}

    window.location.search.substr(1).split('&').forEach((v)=> {
      const [key, value] = v.split('=')
      queryParams[key] = value
    })

    return queryParams
  },

  postMessageToWall(options) {
    if (this.get('isDev')) {
      return RSVP.Promise.resolve()
    }

    return new RSVP.Promise((resolve, reject) => {
      window.VK.api("wall.post", options, () => {
        resolve()
      }, () => {
        reject()
      })
    })
  },

  getUser(options) {
    if (this.get('isDev')) {
      return RSVP.Promise.resolve()
    }

    return new RSVP.Promise((resolve, reject) => {
      window.VK.api("users.get", options, (user) => {
        resolve(user)
      })
    })
  },

  _getCurrentUser() {
    return this.getUser().then(({response}) => {
      this.set('profileInfo', response[0])
    })
  },

  _permissionRequest() {
    window.VK.callMethod("showSettingsBox", 8214);
  }
});
