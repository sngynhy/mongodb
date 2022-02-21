// Promise : 비동기 작업이 모두 끝난 후 완료 또는 실패와 그 결과 값을 나타낸다.
// promise는 3가지 상태를 갖는다.
    // 1. pending : 대기 상태로써 아직 resolve할지 reject할지 결정되지 않은 초기의 상태
    // 2. fullfilled : 이행 상태로써 연산이 성공적으로 완료된 상태
    // 3. rejected : 거부 상태로써 연산이 실패한 상태
    const addSum = (a, b) => new Promise((resolve, reject) => {
        setTimeout(() => {
            if (typeof a !== 'number' || typeof b !== 'number') reject('a, b must be number');
            resolve(a + b);
        }, 3000);
});

addSum(10, 20)
    .then(sum => console.log({ sum: sum }))  // .then - promise 종료 후 resolve 시 실행
    .catch(error => console.log({ error: error }))  // .catch - promise 종료 후 reject 시 실행 (에러잡기)

// chaining promises - promise를 여러 번 사용하는 경우 chain이 여러 개 연결된 것 처럼 then을 원하는 만큼 연결하여 사용할 수 있다.
const promise = new Promise((resolve, reject) => {
    resolve(2);
});

const plusOne = num => num + 1;
promise
    .then(plusOne) // 3
    .then(plusOne) // 4
    .then(plusOne) // 5
    .then(plusOne) // 6
    // .then(() => {
    //     throw Error("error") // 강제 에러 발생
    // })
    .then(result => console.log({ result: result})) // 6
    .catch(error => console.log(error));
////////////////////
addSum(10, 40)
    .then(sum => addSum(sum, 10))
    .then(sum => addSum(sum, 10))
    .then(sum => addSum(sum, 10))
    .then(sum => console.log({ totalSum: sum }))
    .catch(error => console.log(error));

// ★★★★★Async Await★★★★★
const totalSum = async () => { // 해당 함수를 async 함수로 생성함 (비동기 함수) : promise를 반환
    try {
        let sum1 = await addSum(10,20);
        let sum2 = await addSum(sum1, 10);
        let sum3 = await addSum(sum1, sum2);
        console.log({ sum1, sum2, sum3 });
    } catch(err) {
        if(err) console.log({ err: err })
    }
}
totalSum();