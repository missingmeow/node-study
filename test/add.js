/**
 * 加法运算
 */

module.exports = {
    add: (a, b) => {
        if (typeof a === 'number' && typeof b === 'number') {
            return a + b;
        }

        return undefined;
    }
}
