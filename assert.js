const assert = require('assert');
describe('TEST TITLE 1', function () {
  describe('TEST TITLE 2', function () {
    describe('TEST TITLE 3', function () {
      it('should return -1 when the value is not present', function () {
        assert.equal([1, 2, 3].indexOf(4), -1);
      });
      it('should return 2 when the value 3 is present', function () {
        assert.equal([1, 2, 3].indexOf(2), 1);
      });
    });
  });
});

describe('TEST TITLE 4', function () {
  it('should return -1 when the value is not present', function () {
    assert.equal([1, 2, 3].indexOf(4), -1);
  });
  it(`should return ${[1, 2, 3].indexOf(2)} when the value 2 is present`, function () {
    assert.equal([1, 2, 3].indexOf(2), 1);
  });
});