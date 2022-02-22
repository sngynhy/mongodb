const { Router } = require("express");
const commentRouter = Router({ mergeParams: true });
// mergeParams : 상위 라우터에서 req.params 값을 유지하는 것을 의미
// 현재 comment는 blog/:blogId/comment와 같이 접근해야함
// 즉, blog의 자식(하위)으로 봐야하기 때문에 mergeParams: true 설정 필요
const { Blog, User, Comment } = require("../models");
// const { Blog } = require("../models/Blog");
// const { User } = require("../models/User");
// const { Comment } = require("../models/Comment");
const { isValidObjectId } = require("mongoose");

// 데이터 생성
// 조건1) blogId를 입력받아 해당 블로그에 comment가 달리도록
// 조건2) 해당 블로그의 islive가 true인 상태일 경우에만 달리도록
commentRouter.post('/', async (req, res) => {
    try {
        const { blogId } = req.params;
        const { content, userId } = req.body;
        if (!isValidObjectId(blogId)) return res.status(400).send({ err: "blogId is invalid" });
        if (!isValidObjectId(userId)) return res.status(400).send({ err: "userId is invalid" });
        if (!content) return res.status(400).send({ err: "contend is required" });

        // 요청받은 blogId, userId가 존재하는지 조회
        const blog = await Blog.findByIdAndUpdate(blogId);
        const user = await User.findByIdAndUpdate(userId);

        // promise를 이용한 비동기 처리로 데이터를 불러오는 시간을 단축시킬 수 있다.
        // const [blog, user] = await promise.all({
        //     Blog.findByIdAndUpdate(blogId),
        //     User.findByIdAndUpdate(userId)
        // });

        // 존재하지 않을 경우
        if (!blog || !user) return res.status(400).send({ err: "blog or user does not exist" });
        // 존재할 경우 해당 blog의 islive == true/false 여부 체크
        if (!blog.islive) return res.status(400).send({ err: "blog is not available" });

        // comment document 생성
        const comment = new Comment({ content, user, blog });
        await comment.save();
        return res.send({ comment });
    } catch(err) {
        console.log(err);
        return res.status(500).send({ err: err.message });
    }
});

// 데이터 조회
commentRouter.get('/', async (req, res) => {
    try {
        const { blogId } = req.params;
        if (!isValidObjectId(blogId)) return res.status(400).send({ err: "blogId is invalid" });

        const comments = await Comment.find({ blog: blogId });
        return res.send({ comments });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err: err.message });   
    }
});

module.exports = {
    commentRouter
}