const { Router } = require("express");
const userRouter = Router();
const { User, Blog, Comment } = require("../models"); // User 파일에 생성된 User model 가져오기
const mongoose = require("mongoose");

// 전체 데이터 조회 - GET
userRouter.get("/", async (req, res) => {
  try {
    const users = await User.find({}); // 저장된 user 데이터 조회하기
    return res.send({ users });
  } catch (err) {
    // 서버 오류
    console.log(err);
    return res.status(500).send({ err: err.message }); // 서버오류
  }
});

// 특정 데이터 조회 (쿼리스트링)
userRouter.get("/:userId", async (req, res) => {
  // console.log({ params: req.params });
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId))
      return res.status(400).send({ err: "invalid userID" }); // isValidObjectId() : 유효한 아이디인지 검증하는 mongoose 내장 메서드
    const user = await User.findOne({ _id: userId });
    return res.send({ user });
  } catch (err) {
    console.loe(err);
    return res.status(500).send({ err: err.message });
  }
});

// 데이터 저장 - POST
userRouter.post("/", async (req, res) => {
  try {
    // let username = req.body.username;
    // let name = req.body.name;
    let { username, name } = req.body; // 위의 코드 두 줄을 간단히 나타낸 코드 - body안의 key(username, name)를 변수로 선언

    if (!username) return res.status(400).send({ err: "username is required" });
    if (!name || !name.first || !name.last)
      return res
        .status(400)
        .send({ err: "Both first and last name are required" });

    const user = new User(req.body); // user document 생성
    await user.save(); // 데이터 저장
    // insert() : _id가 중복되면 에러 발생
    // save() : _id가 중복되면 덮어쓰기로 저장 (update)
    return res.send({ user });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message }); // 서버오류
  }
});

// 데이터 삭제 - DELETE
userRouter.delete("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId))
      return res.status(400).send({ err: "invalid userId" });
      const [user] = await Promise.all([
        User.findByIdAndDelete({ _id: userId }), // findByIdAndDelete() : id 조회 및 데이터 삭제 후 해당 user 반환 / deleteOne() : 데이터 삭제 (반환X - 좀 더 효율적임)
        Blog.deleteMany({ "user._id": userId }), // user 삭제 시 해당 user가 작성한 blog 삭제
        Blog.updateMany({ "comments.user": userId }, {$pull: { comments: { user: userId }}}),  // blog안에 저장된 comment 삭제
        Comment.deleteMany({ "user": userId }) // user 삭제 시 해당 user가 작성한 comment 삭제

    ]);
    return res.send({ user }); // 삭제된 user 반환
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

// 데이터 수정 - PUT
// user name 변경 시 blog collection, comment collection의 user name 필드도 함께 udpate
userRouter.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId))
      return res.status(400).send({ err: "invalid userId" });
    // age 변경
    const { age, name } = req.body;
    if (!age && !name)
      return res.status(400).send({ err: "age or name is required" });
    if (age && typeof age !== "number")
      return res.status(400).send({ err: "age must be a number" });
    if (name && typeof name.first !== "string" && typeof name.last !== "string")
      return res.status(400).send({ err: "first and last name are strings" });

    // const user = await User.findByIdAndUpdate(userId, { $set: { age: age } }, { new: true }); // findByIdAndUpdate(_id(키값), 변경할 filed) , { new: true } : 변경된 데이터가 반영되어 반환하도록 설정

    // 만약 변경하고자 하는 filed의 갯수가 2개 이상일 경우 아래와 같은 방법으로 작성 - 변경되지 않는 값이 null이 되지 않도록
    // 방법1) findOneAndUpdate() : 조회 후 해당 데이터가 존재하면 udpate 처리하여 해당 데이터 반환 - DB를 한번만 거치기 때문에 시간이 절약됨(효율적, 구조가 간단한 경우엔 이 방법으로)
    // let updateBody = {};
    // if (age) return updateBody.age = age;
    // if (name) return updateBody.name = name;
    // const user = await User.findByIdAndUpdate(userId, updateBody, { new: true }); // findByIdAndUpdate() : 만약 userId에 해당하는 데이터가 있다면 update 처리

    // 방법2) findOne -> DB -> update & mongoose check -> save() -> DB -> success! 이 경우 DB를 두번 거치기 때문에 비교적 시간이 오래 걸리지만
    // 데이터 구조가 복잡(여러개의 instance를 불러와 복합적으로 처리가 필요)하여 직접 수정이 필요한 경우 이 방법이 좋다!
    let user = await User.findById(userId);
    console.log({ userBeforeEdit: user });
    if (age) user.age = age;
    if (name) {
      user.name = name;
      await Promise.all([
        // userFullName 변경 시 blog collection의 username 필드도 함께 udpate
        await Blog.updateMany({ "user._id": userId }, { "user.name": name }),
        // userFullName 변경 시 blog collection의 comments > comment들의 userFullName udpate
        // await Blog.updateMany(  // <<<<<<<< 코드 수정 (왜 안되는지 모르겠다!!!!!!)
        //   {}, // filter 생략
        //   { "comments.$[comment].userFullName": `${name.first} ${name.last}` },  // element == comment
        //   { arrayFilters: [{ "comment.user": userId }] }  // filter 적용
        // )
      ]);
    }
    console.log({ userAfterEdit: user });
    await user.save();
    return res.send({ user });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

// userRouter 외부에서 사용할 수 있도록 exports
module.exports = {
  userRouter,
};
