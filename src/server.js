const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { userRouter } = require("./routes/userRoute");
const { blogRouter } = require("./routes/blogRouter");

// mongoDB connect - [BlogAPI] 생성 예정이므로 myFirstDatabase 네임을 BlogService로 변경
const MONGO_URI = "mongodb+srv://sngynhy:uhzJQ6W2dgFC2xTe@cluster0.bxsto.mongodb.net/BlogService?retryWrites=true&w=majority";

// MongoDB 연결 함수
const server = async() => { // async 함수로 생성해주기
    try {
        await mongoose.connect(MONGO_URI);// mongoDB Connection - await을 했기 때문에 mongoDB 선 연결 후 아래 코드 실행
        mongoose.set('debug', true); // mongoose가 내부적으로 어떤 작업을 하는지 확인 - 어떻게 mongoDB 쿼리로 바꿔주는지
        console.log('MongoDB connected');

        app.use(express.json()); // jseon.parse (middleware)
        app.use(express.urlencoded({ extended: true }));
        
        // 미들웨어 - /user로 시작할 경우 userRouter 연결
        app.use("/user", userRouter);
        app.use("/blog", blogRouter);

        app.listen(3000, () => console.log("server listening on port 3000"));   
    } catch(err) {
        console.log(err);
    }
}
server();