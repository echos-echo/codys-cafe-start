// returns array of items that the provided arrays all have in common
const intersection = (...args) => {
  return args.reduce((prev, curr) => {
    return prev.filter(thing => curr.includes(thing));
  })
}

// a version of .flat() that will run rescursively and completely
// flatten an array that has any number of nested sub-arrays
// currently only works for numbers... but could add other type comparisons too
// i feel like this shouldn't work but it does??????
const flattenDeep = (arr, i = 0) => {
  // this is the recursive case...
  // it checks if there is a sub-array present (so NOT a primitive type!!!)
  if(arr.some(thing => typeof thing !== 'number')) {
    // will send a flattened version of that into the next call!
    return flattenDeep(arr.flat(), i++);
  }
  // and this is the base case?????
  // just returns the array as is if there is no sub-array to be found
  return arr;
}

// creates a function, given a function, that runs said function but with parameters in reverse order
const flipArguments = (func) => {
  return (...args) => {
    return func(...args.reverse());
  }
}

// inverts the keys and values of an object
const invert = (obj) => {
  // the keys of the object, to be the values in the new obj!
  const toBeValues = Object.keys(obj);
  // this will be our new inverted object :)
  const thing = {};
  // for each value of the object, it makes a key of that value-name
  Object.values(obj).forEach((key, ind) => {
    // ... and its value is assigned the corresponding key it belonged to
    thing[key] = toBeValues[ind];
  })
  return thing;
}

// returns an inputted string but in camelCase format (all words sans the first is capitalized and then conjoined)
// works for any number of whitespace and any number of '_' underscores
const camelCase = (str) => {
  /* by .split(), each word is its own array element, even empty strings */
  return str.split(/[_\s]+/).reduce((prev, currWord, ind) => currWord.length === 0 ? prev :
    // if the current word is a valid word...
    // checks if there is a first word already or not!!!
    prev === '' ? prev += currWord[0].toLowerCase() + currWord.slice(1) : prev += currWord[0].toUpperCase() + currWord.slice(1)
    , '')
}

module.exports = {
  intersection,
  flattenDeep,
  flipArguments,
  invert,
  camelCase
}
