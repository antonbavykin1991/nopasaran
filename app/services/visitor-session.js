import Ember from 'ember';
import config from '../config/environment';
import firebase from 'firebase';

window.firebase = firebase;

export default Ember.Service.extend({
  store: Ember.inject.service(),
  session: Ember.inject.service(),
  vk: Ember.inject.service(),

  visitor: null,

  vkProfileInfo: Ember.computed.readOnly('vk.profileInfo'),

  isAuthenticated: Ember.computed.readOnly('session.isAuthenticated'),

  isAdmin: Ember.computed.readOnly('visitor.isAdmin'),

  signUp (params) {
    let deferred = Ember.RSVP.defer()
    let {email, password} = params

    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        return this.checkWhiteList(params)
          .then((isAdmin) => {
            params.isAdmin = isAdmin
          })
          .then(() => {
            return this._createUser({
              uid: user.uid,
              isAdmin: params.isAdmin,
              email
            })
          })
          .then(() => this.signIn(params))
      }, ({code}) => {
        if (code === 'auth/email-already-in-use') {
          return this.signIn(params)
        }
      })
  },

  _createUser({uid, email, isAdmin}) {
    return this.get('store').createRecord('user', {
      id:uid,
      uid,
      email,
      isAdmin
    })
    .save()
    .catch((error) => {
      console.log(error)
    });
  },

  _checkOnPermissions(permissionNumber = 1) {
    return {
      isAdmin: permissionNumber * 1 === 4
    }
  },

  signIn ({email, password}) {
    return this.get('session').open('firebase', {
      provider: 'password',
      email,
      password
    }).then(() => this.syncUser())
  },

  signOut () {
    return this.get("session").close()
  },

  checkWhiteList ({email, permissionNumber}) {
    if (this._checkOnPermissions(permissionNumber).isAdmin) {
      return firebase.database().ref("whitelists")
        .once("value")
        .then((snapshot) => snapshot.child(email.replace('.', '%2E')).val())
    } else {
      return RSVP.Promise.resolve(false)
    }
  },

  checkUserOnSession(params) {
    return this.get('session')
      .fetch()
      .then(() => this.syncUser())
      .then((isCreated) => {
        if (!isCreated) {
          return this.checkWhiteList(params).then((isAdmin) => {
            return this._createUser({
              uid: this.get('session.currentUser.uid'),
              email: params.email,
              isAdmin
            })
          }).then((visitor) => {
            return this.set('visitor', visitor)
          })
        }
      })
      .catch(() => {
        return this.signUp(params)
      })
  },

  syncUser() {
    const id = this.get('session.currentUser.uid')

    return this
      .get('store')
      .findRecord('user', id)
      .then((visitor) => {
        return this.set('visitor', visitor)
      }, () => {
        return false
      })
  }

});
