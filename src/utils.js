'use strict';

/**
 * Extend an object with one or more objects.
 *
 * @param {Object} baseObject - The base object to be extend
 * @param {...Object} objects - The objects to extend the base object
 * @return {Object} - The extended base object
 */
export function extend(baseObject, ...objects) {
  objects.forEach(object => {
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        baseObject[key] = object[key];
      }
    }
  });

  return baseObject;
}
