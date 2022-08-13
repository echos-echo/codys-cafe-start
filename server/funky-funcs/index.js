const intersection = (...args) => {
  return args.reduce((prev, curr) => {
    return prev.filter(thing => curr.includes(thing));
  })
}

// i feel like this shouldn't work but it does??????
const flattenDeep = (arr, i = 0) => {
  // this is the recursive case...
  if(arr.some(thing => typeof thing !== 'number')) {
    return flattenDeep(arr.flat(), i++);
  }
  // and this is the base case?????
  return arr.flat();
}

const flipArguments = (func) => {
  return (...args) => {
    args.reverse();
    return func(...args);
  }
}

const invert = (obj) => {
  const toBeValues = Object.keys(obj);
  const toBeKeys = Object.values(obj);
  const thing = {};
  toBeKeys.forEach((key, ind) => {
    thing[key] = toBeValues[ind];
  })
  return thing;
}

const camelCase = (str) => {
  const regex = /[_*\s*]/ig
  let cameling = str.replaceAll(regex, ' ')
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => word = word[0].toUpperCase() + word.slice(1))
    .join('');
  const final = cameling[0].toLowerCase() + cameling.slice(1);
  return final;
}

module.exports = {
  intersection,
  flattenDeep,
  flipArguments,
  invert,
  camelCase
}
