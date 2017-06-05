import Ember from 'ember';
import config from '../config/environment';

const { inject: { service }, Mixin, assert, computed } = Ember;

export default Mixin.create({
  session: service('session'),

  /**
    The route to transition to for authentication. The
    {{#crossLink "AuthenticatedRouteMixin"}}{{/crossLink}} will transition to
    this route when a route that implements the mixin is accessed when the
    route is not authenticated.
    @property authenticationRoute
    @type String
    @default 'auth'
    @public
  */
  authenticationRoute: computed(function() {
    return config.authenticationRoute
  }),

  /**
    Checks whether the session is authenticated and if it is not aborts the
    current transition and instead transitions to the
    {{#crossLink "config/authenticationRoute:property"}}{{/crossLink}}.
   `beforeModel` method is actually executed.
    @method beforeModel
    @param {Transition} transition The transition that lead to this route
    @public
  */
  beforeModel() {
    if (!this.get('session.isAuthenticated')) {
      let authenticationRoute = this.get('authenticationRoute')

      assert('The route configured as config.authenticationRoute cannot implement the AuthenticatedRouteMixin mixin as that leads to an infinite transitioning loop!', this.get('routeName') !== authenticationRoute)

      return this.transitionTo(authenticationRoute)
    } else {
      return this._super(...arguments)
    }
  }
});