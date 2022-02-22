const { Schema, model, Types } = require("mongoose");

// 스키마 생성
const BlogSchema = new Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    islive: {type: Boolean, required: true, default: false}, // 게시글 임시 저장 기능 - true: 발행, false: 임시저장
    user: {type: Types.ObjectId, required: true, ref: "user"} // ref: "user"는 UserSchema를 참조한다는 것은 mongoose에게 알려줌. ("user"는 UserSchema의 이름)
}, { timestamps: true }); // createdAt, updateAt

// 가상 스키마 추가 - 가상으로 blog collection에 comments 필드 생성
BlogSchema.virtual("comments", {
    ref: "comment",
    localField: "_id",
    foreignField: "blog"
});
BlogSchema.set("toObject", { virtuals: true });
BlogSchema.set("toJSON", { virtuals: true });

// 모델 생성
const Blog = model('blog', BlogSchema);
module.exports = { Blog };