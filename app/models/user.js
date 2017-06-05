import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  uid: attr('string'),
  email: attr('string'),
  isAdmin: attr('boolean')
});
