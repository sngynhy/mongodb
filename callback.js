const { reject } = require("underscore");

// callback
const addSum = (a, b, callback) => {
    setTimeout(() => { // setTimeout() : 코드를 바로 실행하지 않고 지정한 시간만큼 기다렸다가 로직을 실행 1000 -> 1초
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

// 참고 : https://joshua1988.github.io/web-development/javascript/javascript-asynchronous-operation/