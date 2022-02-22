const { Schema, model, Types:{ ObjectId } } = require("mongoose");

// 스키마 생성
const CommentSchema = new Schema({
    content: {type: String, required: true},
    user: {type: ObjectId, required: true, ref: "user"},
    blog: {type: ObjectId, required: true, ref: "blog"}
});

// 모델 생성
const Comment = model('comment', CommentSchema);
module.exports = { Comment };