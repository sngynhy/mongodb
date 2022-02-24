const { Router } = require("express");
const { Blog, User, Comment } = require("../models");
const { isValidObjectId } = require("mongoose");
const { send } = require("express/lib/response");
const commentRouter = Router({ mergeParams: true });
// mergeParams : 상위 라우터에서 req.params 값을 유지하는 것을 의미
// 현재 comment는 blog/:blogId/comment와 같이 접근해야함
// 즉, blog의 자식(하위)으로 봐야하기 때문에 mergeParams: true 설정 필요

// 데이터 생성
// 조건1) blogId를 입력받아 해당 블로그에 comment가 달리도록
// 조건2) 해당 블로그의 islive가 true인 상태일 경우에만 comment가 달리도록
commentRouter.post("/", async (req, res) => {
  try {
    const { blogId } = req.params;
    const { content, userId } = req.body;
    if (!isValidObjectId(blogId))
      return res.status(400).send({ err: "blogId is invalid" });
    if (!isValidObjectId(userId))
      return res.status(400).send({ err: "userId is invalid" });
    if (!content) return res.status(400).send({ err: "contend is required" });

    // 요청받은 blogId, userId가 존재하는지 조회
    // const blog = await Blog.findById(blogId);
    // const user = await User.findById(userId);

    // => promise를 이용한 비동기 처리로 데이터를 불러오는 시간을 단축시킬 수 있다.
    const [blog, user] = await Promise.all([
      Blog.findById(blogId),
      User.findById(userId),
    ]);

    // 존재하지 않을 경우
    if (!blog || !user)
      return res.status(400).send({ err: "blog or user does not exist" });
    // 존재할 경우 해당 blog의 islive == true/false 여부 체크
    if (!blog.islive)
      return res.status(400).send({ err: "blog is not available" });

    // comment document 생성
    const comment = new Comment({
      content,
      user,
      userFullName: `${user.name.first} ${user.name.last}`,
      blog,
    });
    ////////////////////////////////////////////////// blog collection에 comments 추가
    // 1. comment collection에 저장 2. 해당 blog에 추가된 comment데이터를 comments필드에 업데이트(push)
    await Promise.all([
      comment.save(),
      Blog.updateOne({ _id: blogId }, { $push: { comments: comment } }), // $push: 요소 추가
    ]);

    return res.send({ comment });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

// 데이터 조회
commentRouter.get("/", async (req, res) => {
  try {
    const { blogId } = req.params;
    if (!isValidObjectId(blogId))
      return res.status(400).send({ err: "blogId is invalid" });

    const comments = await Comment.find({ blog: blogId });
    return res.send({ comments });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

// 데이터 수정
commentRouter.patch("/:commentId", async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    if (typeof content !== "string")
      return res.status(400).send({ err: "content must be a String" });
    if (!content) return res.status(400).send({ err: "content is required" });

    const [comment] = await Promise.all([
      // Comment collection에서 commentId에 해당하는 데이터를 찾아 update
      Comment.findByIdAndUpdate({ _id: commentId }, { content }, { new: true }),
      // Blog collection에서 commentId에 해당하는 데이터 수정
      await Blog.updateOne(
        { "comments._id": commentId },
        { "comments.$.content": content } // .$. : 위의 filter("comments._id": commentI)에 대응하는 element를 선택
      ),
    ]);
    return res.send({ comment });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

// 데이터 삭제
commentRouter.delete("/:commentId", async (req, res) => {
  try {
    const { commentId } = req.params;
    if (!isValidObjectId(commentId))
      return res.status(400).send({ err: "invalid commentIdd" });

    const comment = await Comment.findByIdAndDelete({ _id: commentId }); // findByIdAndDelete() : id 조회 및 데이터 삭제 후 해당 데이터 반환 / deleteOne() : 데이터 삭제 (반환X - 좀 더 효율적임)
    await Blog.updateOne(
      // Blog collection에 저장되어있는 comment 목록에서도 삭제
      { "comments._id": commentId },
      { $pull: { comments: { _id: commentId } } } // $pull : 배열에서 해당 데이터 삭제
    );
    return res.send({ comment }); // 삭제된 user 반환
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

module.exports = {
  commentRouter,
};
