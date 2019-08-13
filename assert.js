const assert = require('assert');
describe('top suite', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
    it('should return 2 when the value 3 is present', function () {
      assert.equal([1, 2, 3].indexOf(3), 2);
    });
  });
  describe('yoyo', function () {
    it('should return 1 when the value 2 is present', function () {
      assert.equal([1, 2, 3].indexOf(2), 1);
    });
  });
});