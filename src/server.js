const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { userRouter, blogRouter } = require("./routes");
const { generateFakeData } = require("../faker");

// mongoDB connect - [BlogAPI] 생성 예정이므로 myFirstDatabase 네임을 BlogService로 변경
const MONGO_URI = "mongodb+srv://sngynhy:uhzJQ6W2dgFC2xTe@cluster0.bxsto.mongodb.net/BlogService?retryWrites=true&w=majority";

// MongoDB 연결 함수
const server = async() => { // async 함수로 생성해주기
    try {
        await mongoose.connect(MONGO_URI);// mongoDB Connection - await을 했기 때문에 mongoDB 선 연결 후 아래 코드 실행
        mongoose.set('debug', true); // mongoose가 내부적으로 어떤 작업을 하는지 확인 - 어떻게 mongoDB 쿼리로 바꿔주는지
        console.log('MongoDB connected');

        // faker를 이용한 랜덤 데이터 생성
        await generateFakeData(100, 10, 300); // (userCount, blogsPerUser, commentsPerUser)

        app.use(express.json()); // jseon.parse (middleware)
        app.use(express.urlencoded({ extended: true }));
        
        // 미들웨어 - /user로 시작할 경우 userRouter 연결
        app.use("/user", userRouter);
        app.use("/blog", blogRouter);
        // app.use("/blog/:blogId/comment", commentRouter); // blog와 부모 자식 관계
        // commentRouter를 위의 방식으로 추가하거나
        // comment의 상위 router인 blogRouter파일에 추가해줄 수 있음

        app.listen(3000, () => console.log("server listening on port 3000"));   
    } catch(err) {
        console.log(err);
    }
}
server();