import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import {belongsTo, hasMany} from 'ember-data/relationships';

export default Model.extend({
  hookah: hasMany('hookah'),
  games: hasMany('game'),


  // place: attr(),
  // playstation: attr(),
  // user: attr(),
  // bar: attr(),
  // food: attr(),
  // menu: attr(),
  // hookah: attr(),
  date: attr(),
  time: attr()
});
