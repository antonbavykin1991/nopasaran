import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
  vk: Ember.inject.service(),
  visitorSession: Ember.inject.service(),

  beforeModel() {
    const {
      auth_key,
      viewer_id,
      viewer_type
    } = this.get('vk.queryParams')

    return RSVP.hash({
      sessionLoader: this.get('visitorSession').checkUserOnSession({
        email: `nopasaran_${viewer_id}@gmail.com`,
        password: auth_key,
        permissionNumber: viewer_type
      }),

      vkLoader: this.get('vk').initVK()
    });
  }
});
