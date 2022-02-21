// mongoose로 user 데이터에 대한 정보 가져오기
const mongoose = require("mongoose");
// const { Schema, model } = require("mongoose"); 과 같이 선언 가능

// 스키마 생성 - Schema(객체 정보, 옵션 정보)
const UserSchema = new mongoose.Schema({  // new Schema()
    // user 객체는 어떠한 key-value를 갖고 있는지, 각 key-value마다의 정보(타입, 필수여부 등)를 표시
    // mongoose가 데이터를 확인 후 mongoDB에 반영
    username: { type: String, required: true, unique: true }, // unique: true - 유일해야하고 이미 있는 데이터일 경우 에러 발생
    name: {
        first: { type: String, required: true },
        last: { type: String, required: true }
    },
    age: Number, // == { type: Number } 정보가 한 개일 경우 {}에 감싸주지 않아도 된다.
    email: String
}, { timestamps: true }) // timestamps: true - 데이터 생성 시 생성 시간(createdAt)을 만들어주고, 업데이트 시 updatedAt 키를 수정해준다.

// 모델 생성
// mongoose에게 'user'라는 collection(table) 생성하겠다고 알려주기
const User = mongoose.model('user', UserSchema); // users 이름으로 collection 생성
module.exports = { User }; // 외부에서 User 사용하도록 exports
