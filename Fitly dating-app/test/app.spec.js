const assert = require('assert');
const {expect} = require('chai');
const {mergeSort} = require('../src/mergesortTest')


describe("the merge sort", function () {
    it ("should sort the array in acending order", function () {
        let result = mergeSort([10, 1, 6, 3]);
        expect(result).to.deep.equal([1, 3, 6, 10])
    });
});





