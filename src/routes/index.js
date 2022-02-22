module.exports = {
    ...require("./blogRoute"),
    ...require("./userRoute"),
    ...require("./commentRoute")
};
// 각 파일에 exports한 객체를 불러와서 하나의 객체로 합쳐 exports 해준다.
// 외부 파일(server.js)에서 해당 객체를 require해서 사용할 때 
// const { userRouter } = require("./routes/userRoute");
// const { blogRouter } = require("./routes/blogRoute"); 대신
// >> const { userRouter, blogRouter } = require("./routes"); 와 같이 기재해주면
// 알아서 ./routes 경로에 있는 index.js 파일을 찾아 읽고 처리한다.