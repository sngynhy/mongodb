const { fa } = require("faker/lib/locales");
const { Schema, model, Types } = require("mongoose");
const { CommentSchema } = require("./Comment");

// 스키마 생성 - blog collection에 user, comment shcema 자체를 내장하여 저장
const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    islive: { type: Boolean, required: true, default: false }, // 게시글 임시 저장 기능 - true: 발행, false: 임시저장
    user: { // uer Schrema 내장하기
      _id: { type: Types.ObjectId, required: true, ref: "user" }, // ref: "user"는 UserSchema를 참조한다는 것은 mongoose에게 알려줌. ("user"는 UserSchema의 이름)
      username: { type: String, required: true },
      name: {
        first: { type: String, required: true },
        last: { type: String, required: true },
      },
    },
    comments: {
      _id: { type: Types.ObjectId, required: false, ref: "comment" }, // commentId
      content: { type: String, required: false },
      user: {type: Types.ObjectId, required: false}, // userId
      userFullName: {type: String, required: false}
    },
    // comments: [CommentSchema], // exports한 comment 스키마를 그대로 blog collection에 삽입 << 에러 발생!!! (또는 위의 방법으로 작성해도 상관없음)
  },
  { timestamps: true }
); // createdAt, updateAt

// 가상 스키마 추가 - 가상으로 blog collection에 comments 필드 생성 (DB에는 저장되지 않음)
// BlogSchema.virtual("comments", {
//     ref: "comment",
//     localField: "_id",
//     foreignField: "blog"  // comment collection의 blog 필드를 참조한다.
// });
// BlogSchema.set("toObject", { virtuals: true });
// BlogSchema.set("toJSON", { virtuals: true });

// 모델 생성
const Blog = model("blog", BlogSchema);
module.exports = { Blog };
