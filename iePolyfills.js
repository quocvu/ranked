/* eslint-disable no-bitwise, no-extend-native, prefer-rest-params */

module.exports = function iePolyfills() {
  // IE Polyfill for Array.prototype.fill
  if (!Array.prototype.fill) {
    Object.defineProperty(Array.prototype, 'fill', {
      value(value) {
        // Steps 1-2.
        if (this == null) {
          throw new TypeError('this is null or not defined');
        }

        const O = Object(this);

        // Steps 3-5.
        const len = O.length >>> 0;

        // Steps 6-7.
        const start = arguments[1];
        const relativeStart = start >> 0;

        // Step 8.
        let k = relativeStart < 0
          ? Math.max(len + relativeStart, 0)
          : Math.min(relativeStart, len);

        // Steps 9-10.
        const end = arguments[2];
        const relativeEnd = end === undefined
          ? len : end >> 0;

        // Step 11.
        const final = relativeEnd < 0
          ? Math.max(len + relativeEnd, 0)
          : Math.min(relativeEnd, len);

        // Step 12.
        while (k < final) {
          O[k] = value;
          k += 1;
        }

        // Step 13.
        return O;
      },
    });
  }

  // IE Polyfill for Object.entries
  if (!Object.entries) {
    Object.entries = function entries(obj) {
      const ownProps = Object.keys(obj);
      let i = ownProps.length;
      const resArray = new Array(i); // preallocate the Array

      while (i) {
        i -= 1;
        resArray[i] = [ownProps[i], obj[ownProps[i]]];
      }

      return resArray;
    };
  }
};
