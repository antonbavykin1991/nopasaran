import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import {belongsTo} from 'ember-data/relationships';

export default Model.extend({
  hookah: belongsTo('hookah'),

  title: attr('string'),

  percentage: attr('number')
});
