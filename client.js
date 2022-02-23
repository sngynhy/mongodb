console.log("client code running.");
const axios = require("axios");
// axios : REST API 호출 시 사용되는 모듈

const URI = "http://localhost:3000";

const test = async () => {
    console.time("loading time: "); // 로딩 시간 체크
    // blog 데이터 불러오기
    await axios.get(`${URI}/blog`);

    // // user 데이터 불러오기
    // blogs.userId = await Promise.all(blogs.map(async blog => { // map() : 데이터 가공에 용이
    //     const [res1, res2] = await Promise.all([axios.get(`${URI}/user/${blog.user}`), axios.get(`${URI}/blog/${blog._id}/comment`)]);
    //     blog.user = res1.data.user;
    //     blog.comments = await Promise.all(res2.data.comments.map(async comment => {
    //         const { data: { user } } = await axios.get(`${URI}/user/${comment.user}`);
    //         comment.user = user;
    //         return comment;
    //     }));        
    //     return blog;
    // }));
    // console.dir(blogs[0], { depth: 10 });
    console.timeEnd("loading time: ");
};

const testGroup = async () => {
    await test();
    await test();
    await test();
    await test();
    await test();
    await test();
    await test();
};

testGroup();