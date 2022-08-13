/* eslint-env mocha, chai */

const {expect} = require('chai')
const {
  intersection,
  flattenDeep,
  flipArguments,
  invert,
  camelCase
} = require('../server/funky-funcs')

describe('Funky functions', () => {
  // intersection
  // Creates an array of unique values that are included in the two given arrays.
  // Based on: https://lodash.com/docs/4.17.5#intersection
  describe('intersection', () => {
    it('returns an array', () => {
      expect(intersection([], [])).to.be.an('array')
    })

    it('returns an array with the unique values from each array', () => {
      const arr1 = [1, 2, 3]
      const arr2 = [2, 4, 6]

      expect(intersection(arr1, arr2)).to.deep.equal([2])
    })

    it('returns an empty array when there are no matches', () => {
      const arr1 = [1, 2, 3]
      const arr2 = [4, 5, 6]

      expect(intersection(arr1, arr2)).to.deep.equal([])
    })

    it('does not mutate the input arrays', () => {
      const arr1 = [1, 2, 3]
      const arr2 = [4, 5, 6]

      intersection(arr1, arr2)

      expect(arr1).to.deep.equal(arr1)
      expect(arr2).to.deep.equal(arr2)
    })

    it('handles duplicates', () => {
      const arr1 = [1, 2, 3]
      const arr2 = [2, 2, 6]

      expect(intersection(arr1, arr2)).to.deep.equal([2])
    })

    it('works with strings as well as numbers', () => {
      const arr1 = ['a', 'b', 'c']
      const arr2 = ['b', 'i', 'c']

      expect(intersection(arr1, arr2)).to.deep.equal(['b', 'c'])
    })

    it('EXTRA CREDIT: works for any number of arrays', () => {
      const arr1 = [1, 2, 3, 7]
      const arr2 = [1, 4, 5, 2]
      const arr3 = [2, 1, 1, 9]
      const arr4 = [6, 1, 2, 8]

      expect(intersection(arr1, arr2, arr3, arr4)).to.deep.equal([1, 2])
    })
  }) // end: intersection

  describe('flattenDeep', () => {
    // flattenDeep
    // recursively flattens array
    // Based on: https://lodash.com/docs/4.17.5#flattenDeep
    it('returns an array', () => {
      expect(flattenDeep([])).to.be.an('array')
    })

    it('recursively flattens array', () => {
      expect(flattenDeep([1, [2]])).to.deep.equal([1, 2])
      expect(flattenDeep([1, [2], 3, [4, 5]])).to.deep.equal([1, 2, 3, 4, 5])
    })

    it('does not mutate original array', () => {
      const arr = [1, [2]]
      flattenDeep(arr)
      expect(arr).to.deep.equal(arr)
    })

    it('recursively flattens many levels deep', () => {
      expect(flattenDeep([1, [2, [3, [4]], 5]])).to.deep.equal([1, 2, 3, 4, 5])
    })
  }) // end: flattenDeep

  describe('flipArguments', () => {
    // flipArguments
    // Creates a function that invokes the input func with arguments reversed
    // Based on: https://lodash.com/docs/4.17.5#flip
    it('returns a function', () => {
      const func = () => {}
      expect(flipArguments(func)).to.be.a('function')
    })

    it('returns function with arguments flipped', () => {
      const floorDivide = (a, b) => Math.floor(a / b)
      const flippedFloorDivide = flipArguments(floorDivide)

      expect(floorDivide(4, 2)).to.equal(2)
      expect(flippedFloorDivide(4, 2)).to.equal(0)
    })

    it('works for any number of arguments', () => {
      const toArray = (a, b, c, d) => Array.of(a, b, c, d)
      const flippedToArray = flipArguments(toArray)

      expect(toArray(1, 2, 3, 4)).to.deep.equal([1, 2, 3, 4])
      expect(flippedToArray(1, 2, 3, 4)).to.deep.equal([4, 3, 2, 1])
    })
  }) // end: flipArguments

  describe('invert', () => {
    // invert
    // Creates an object composed of the inverted keys and values of object.
    // If the input object contains duplicate values, subsequent values overwrite previous values
    // Based on: https://lodash.com/docs/4.17.5#invert
    it('returns an object', () => {
      expect(invert({})).to.be.an('object')
    })

    it('inverts keys and values', () => {
      const obj = {
        'a': 1,
        'b': 2,
        'c': 'foo'
      }

      expect(invert(obj)).to.deep.equal({
        '1': 'a',
        '2': 'b',
        'foo': 'c'
      })
    })

    it('handles duplicates', () => {
      const obj = {
        'a': 1,
        'b': 2,
        'c': 1
      }

      expect(invert(obj)).to.deep.equal({
        '1': 'c',
        '2': 'b'
      })
    })
  }) // end: invert

  describe('camelCase', () => {
    // camelCase
    // converts input string to camelCase
    // Based on: https://lodash.com/docs/4.17.5#camelCase
    it('converts spaces to camelCase', () => {
      expect(camelCase('foo bar')).to.equal('fooBar')
    })

    it('handles capital letters', () => {
      expect(camelCase('Foo Bar')).to.equal('fooBar')
    })

    it('handles many spaced words, including multiple spaces', () => {
      expect(camelCase('foo bar baz  bat')).to.equal('fooBarBazBat')
    })

    it('converts snake_case to camelCase', () => {
      expect(camelCase('foo_bar')).to.equal('fooBar')
    })

    it('handles capital letters in snake_case', () => {
      expect(camelCase('Foo_bar')).to.equal('fooBar')
    })

    it('handles many words, including multiple underscores', () => {
      expect(camelCase('__hello_world_how_are_you'))
        .to.equal('helloWorldHowAreYou')
    })
  }) // end: camelCase
})
