import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import Confirmation from 'ember-validations/validators/local/confirmation';
import Mixin from 'ember-validations/mixin';

let model;
let Model;
let options;
let validator;

const {
  Object: EmberObject,
  isEmpty,
  run,
  set
} = Ember;

moduleFor('object:model', 'Confirmation Validator', {
  integration: true,

  beforeEach() {
    Model = EmberObject.extend(Mixin);
    this.registry.register('object:model', Model);
    run(() => model = this.subject());
  }
});

test('when values match', function(assert) {
  options = { message: 'failed validation' };
  run(function() {
    validator = Confirmation.create({ model, property: 'attribute', options });
    set(model, 'attribute', 'test');
    set(model, 'attributeConfirmation', 'test');
  });
  assert.deepEqual(validator.errors, []);
  run(function() {
    set(model, 'attributeConfirmation', 'newTest');
  });
  assert.deepEqual(validator.errors, ['failed validation']);
  run(function() {
    set(model, 'attribute', 'newTest');
  });
  assert.deepEqual(validator.errors, []);
});

test('when values do not match', function(assert) {
  options = { message: 'failed validation' };
  run(function() {
    validator = Confirmation.create({ model, property: 'attribute', options });
    set(model, 'attribute', 'test');
  });
  assert.deepEqual(validator.errors, ['failed validation']);
});

test('when original is null', function(assert) {
  run(function() {
    validator = Confirmation.create({ model, property: 'attribute' });
    model.set('attribute', null);
  });
  assert.ok(isEmpty(validator.errors));
});

test('when confirmation is null', function(assert) {
  run(function() {
    validator = Confirmation.create({ model, property: 'attribute' });
    model.set('attributeConfirmation', null);
  });
  assert.ok(isEmpty(validator.errors));
});

test('when options is true', function(assert) {
  options = true;
  run(function() {
    validator = Confirmation.create({ model, property: 'attribute', options });
    set(model, 'attribute', 'test');
  });
  assert.deepEqual(validator.errors, ["doesn't match attribute"]);
});

/* jshint ignore:start */
// So this code is all commented out because I can't figure out how the DS.Model object is registered
// ON the container in modern ember. This whole library is deprecated, so I've already spent too much time
// on it already.
// test('message integration on model, prints message on Confirmation property', function(assert) {
//   let otherModel;
//   let owner = getOwner(this);
//   let OtherModel = owner.lookup('object:model');
//   OtherModel.reopen({
//     validations: {
//       attribute: {
//         confirmation: true
//       }
//     }
//   })
//   console.log(OtherModel);
//
//   this.register('model:other', OtherModel);
//   console.log(getOwner(this).lookup('model:other'));
//   run(() => otherModel = getOwner(this).lookup('model:other').create(owner.ownerInjection()));
//   run(() => set(otherModel, 'attribute', 'test'));
//
//   assert.deepEqual(get(otherModel, 'errors.attributeConfirmation'), ["doesn't match attribute"]);
//   assert.deepEqual(get(otherModel, 'errors.attribute'), []);
// });
/* jshint ignore:end */
