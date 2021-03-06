const { Router } = require("express");
const blogRouter = Router();
const { Blog, User } = require("../models");
const { isValidObjectId } = require("mongoose");
const { commentRouter } = require("./commentRoute");

// blog의 하위 경로인 cmommentRouter 연결 추가
blogRouter.use("/:blogId/comment", commentRouter);

// 데이터 생성
blogRouter.post("/", async (req, res) => {
  try {
    let { title, content, islive, userId } = req.body;
    // validation
    if (!title) return res.status(400).send({ err: "title is required" });
    if (!content) return res.status(400).send({ err: "content is required" });
    if (typeof title !== "string")
      return res.status(400).send({ err: "title must be a Stirng" });
    if (typeof content !== "string")
      return res.status(400).send({ err: "content must be a Stirng" });
    if (islive && typeof islive !== "boolean")
      return res.status(400).send({ err: "islive must be a Blooean" });
    if (!isValidObjectId(userId))
      return res.status(400).send({ err: "invalid userId" });
    let user = await User.findById(userId); // userId 조회
    console.log({ user });
    if (!user) return res.status(400).send({ err: "user does not exist" });

    // blog document 생성
    let blog = new Blog({ ...req.body, user }); // user를 넣어도 save() 실행 시 mongoose가 알아서 _id로 저장해줌
    // console.log('@@@@@@@',blog);
    await blog.save(); // 데이터 저장
    return res.send({ blog });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

// 전체 데이터 조회 - pagination 기능 추가
blogRouter.get("/", async (req, res) => {
  try {
    let { page } = req.query;  // 쿼리 스트링으로 받은 파라미터값
    page = parseInt(page);  // req.query는 String 타입으로 반환하기 때문에 int 타입으로 형 변환
    console.log({ page: page });
    const blogs = await Blog.find({})
      .sort({ updateAt: -1 })  // 최신 업데이트 순으로 정렬
      .skip(page * 3)
      .limit(3) // 데이터를 3개씩 조회
      .populate([
        { path: "user" },
        { path: "comments", populate: { path: "user" } },
      ]);
    // populate([{ path: "user" }] : 각 blog에 "user"를 채워라. 즉, blog에 user데이터를 추가 - mongoose가 해당 기능 제공
    // { path: "comments", populate: { path: "user" } } : 각 blog에 "comments" 데이터 추가

    return res.send({ blogs });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

// 특정 데이터 조회
blogRouter.get("/:blogId", async (req, res) => {
  try {
    const { blogId } = req.params;
    if (!isValidObjectId(blogId))
      return res.status(400).send({ err: "invalid blogId" });
    const blog = await Blog.findById(blogId);
    return res.send({ blog });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

// 데이터 수정 - 전체
blogRouter.put("/:blogId", async (req, res) => {
  try {
    const { blogId } = req.params;
    if (!isValidObjectId(blogId))
      return res.status(400).send({ err: "invalid blogId" });

    const { title, content } = req.body;
    if (!title) return res.status(400).send({ err: "title is required" });
    if (!content) return res.status(400).send({ err: "content is required" });
    if (typeof title !== "string")
      return res.status(400).send({ err: "title must be a Stirng" });
    if (typeof content !== "string")
      return res.status(400).send({ err: "content must be a Stirng" });

    const blog = await Blog.findOneAndUpdate(
      { _id: blogId },
      { title, content },
      { new: true }
    );
    return res.send({ blog });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});
// 데이터 수정 - 부분
// live를 false -> true로 수정
blogRouter.patch("/:blogId/islive", async (req, res) => {
  try {
    const { blogId } = req.params;
    if (!isValidObjectId(blogId))
      return res.status(400).send({ err: "invalid blogId" });

    const { islive } = req.body;
    if (typeof islive != "boolean")
      return res.status(400).send({ err: "islive must be a Blooean" });

    const blog = await Blog.findByIdAndUpdate(
      blogId,
      { islive },
      { new: true }
    );
    return res.send({ blog });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

// 데이터 삭제
blogRouter.delete("/:blogId", async (req, res) => {
  try {
    const { blogId } = req.params;
    if (!isValidObjectId(blogId))
      return res.status(400).send({ err: "invalid blogId" });
    const blog = await Blog.findByIdAndDelete({ _id: blogId });
    return res.send({ blog });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

module.exports = {
  blogRouter,
};
