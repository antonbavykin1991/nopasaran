import Ember from 'ember';
import config from '../config/environment';

const {inject: {service}, Mixin} = Ember;

export default Mixin.create({
	session: service(),
  signIn (provider, email, password) {
    this.get('session').open('firebase', {
      provider: provider,
      email: email,
      password: password
    }).then(() => {
    	this.transitionToRoute(config.routeAfterAuthentication);
    });
  },

  signOut () {
    this.get('session').close();
  }
});
