const { Router } = require("express");
const blogRouter = Router();
const { Blog, User } = require("../models");
// const { Blog } = require("../models/Blog");
// const { User } = require("../models/User");
const { isValidObjectId } = require("mongoose");
const { commentRouter } = require("./commentRoute");

// blog의 하위 경로인 cmommentRouter 연결 추가
blogRouter.use("/:blogId/comment", commentRouter);

// 데이터 생성
blogRouter.post('/', async (req, res) => {
    try {
        let { title, content, islive, userId } = req.body;
        // validation
        if (!title) return res.status(400).send({ err: "title is required"});
        if (!content) return res.status(400).send({ err: "content is required"});
        if (typeof title !== 'string') return res.status(400).send({ err: "title must be a Stirng" });
        if (typeof content !== 'string') return res.status(400).send({ err: "content must be a Stirng" });
        if (islive && typeof islive !== 'boolean') return res.status(400).send({ err: "islive must be a Blooean" });
        if (!isValidObjectId(userId)) return res.status(400).send({ err: "invalid userId"});
        let user = await User.findById(userId); // userId 조회
        console.log({ user });
        if (!user) return res.status(400).send({ err: "user does not exist" });

        // blog document 생성
        let blog = new Blog({ ...req.body, user }); // user를 넣어도 save() 실행 시 mongoose가 알아서 _id로 저장해줌
        await blog.save(); // 데이터 저장
        return res.send({ blog });
    } catch(err) {
        console.log(err);
        return res.status(500).send({ err: err.message });
    }
});

// 전체 데이터 조회
blogRouter.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find({});
        return res.send({ blogs });
    } catch(err) {
        console.log(err);
        return res.status(500).send({ err: err.message });
    }
});

// 특정 데이터 조회
blogRouter.get('/:blogId', async (req, res) => {
    try {
        const { blogId } = req.params;
        if (!isValidObjectId(blogId)) return res.status(400).send({ err: "invalid blogId" });
        const blog = await Blog.findById(blogId);
        return res.send({ blog });
    } catch(err) {
        console.log(err);
        return res.status(500).send({ err: err.message });
    }
});

// 데이터 수정 - 전체
blogRouter.put('/:blogId', async (req, res) => {
    try {
        const { blogId } = req.params;
        if (!isValidObjectId(blogId)) return res.status(400).send({ err: "invalid blogId" });

        const { title, content } = req.body;
        if (!title) return res.status(400).send({ err: "title is required"});
        if (!content) return res.status(400).send({ err: "content is required"});
        if (typeof title !== 'string') return res.status(400).send({ err: "title must be a Stirng" });
        if (typeof content !== 'string') return res.status(400).send({ err: "content must be a Stirng" });

        const blog = await Blog.findOneAndUpdate({ _id: blogId }, { title, content }, { new: true });
        return res.send({ blog });
    } catch(err) {
        console.log(err);
        return res.status(500).send({ err: err.message });
    }
});
// 데이터 수정 - 부분
// live를 false -> true로 수정
blogRouter.patch('/:blogId/islive', async (req, res) => {
    try {
        const { blogId } = req.params;
        if (!isValidObjectId(blogId)) return res.status(400).send({ err: "invalid blogId" });

        const { islive } = req.body;
        if (typeof islive != 'boolean') return res.status(400).send({ err: "islive must be a Blooean" });

        const blog = await Blog.findByIdAndUpdate(blogId, { islive }, { new: true });
        return res.send({ blog });
    } catch(err) {
        console.log(err);
        return res.status(500).send({ err: err.message });
    }
});

// 데이터 삭제
blogRouter.delete('/:blogId', async (req, res) => {
    try {
        const { blogId } = req.params;
        if (!isValidObjectId(blogId)) return res.status(400).send({ err: "invalid blogId" });
        const blog = await Blog.findByIdAndDelete({ _id: blogId });
        return res.send({ blog });
    } catch(err) {
        console.log(err);
        return res.status(500).send({ err: err.message });
    }
});

module.exports = {
    blogRouter
}