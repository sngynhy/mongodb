const { reject } = require("underscore");

// Callback
const addSum = (a, b, callback) => {
    setTimeout(() => {
        if (typeof a !== 'number' || typeof b !== 'number') {
            return callback('a, b must be number'); // callback2 함수의 첫번쨰 인자로 error message
        } else {
            return callback(undefined, a + b); // 에러가 아니면 첫번쨰 인자로 undefined, 두번쨰 인자로 결과값
        }
    }, 3000); // 3초 후에 return
}

let callback = (err, sum) => {
    if (err) {
        return console.log({ error: err });
    } else {
        return console.log({ sum: sum });
    }
}

addSum(10, 'z', callback);