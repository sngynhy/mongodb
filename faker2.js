const faker = require("faker");
const { User } = require("./src/models");
const axios = require("axios");
const URI = "http://localhost:3000";

/**
문서 내장으로 읽기 퍼포먼스 극대화
	- 자식 데이터를 부모 데이터의 내장 데이터로 저장하기
	- 이미 취합 및 가공된 상태로 데이터가 저장되기 때문에 부모 데이터만 읽으면 된다 -> 시간 단축
 */
generateFakeData = async (userCount, blogsPerUser, commentsPerUser) => {
  try {
    if (typeof userCount !== "number" || userCount < 1)
      throw new Error("userCount must be a positive integer");
    if (typeof blogsPerUser !== "number" || blogsPerUser < 1)
      throw new Error("blogsPerUser must be a positive integer");
    if (typeof commentsPerUser !== "number" || commentsPerUser < 1)
      throw new Error("commentsPerUser must be a positive integer");
    let users = [];
    let blogs = [];
    let comments = [];

    for (let i = 0; i < userCount; i++) {
      users.push(
        new User({
          username: faker.internet.userName() + parseInt(Math.random() * 100),
          name: {
            first: faker.name.firstName(),
            last: faker.name.lastName(),
          },
          age: 10 + parseInt(Math.random() * 50),
          email: faker.internet.email(),
        })
      );
    }

    console.log("fake data inserting to database...");

    await User.insertMany(users);
    console.log(`${users.length} fake users generated!`);

    users.map((user) => {
      for (let i = 0; i < blogsPerUser; i++) {
        blogs.push(
          axios.post(`${URI}/blog`, {  // axios로 API 호출
            title: faker.lorem.words(),
            content: faker.lorem.paragraphs(),
            islive: true,
            userId: user.id,
          })
        );
      }
    });

    let newBlogs = await Promise.all(blogs); // newBlogs에는 axios에 대한 response가 저장됨 (API의 return값)
    console.log(`${newBlogs.length} fake blogs generated!`);

    users.map((user) => {
      for (let i = 0; i < commentsPerUser; i++) {
        let index = Math.floor(Math.random() * blogs.length);
        comments.push(
          axios.post(`${URI}/blog/${newBlogs[index].data.blog._id}/comment`, {
            content: faker.lorem.sentence(),
            userId: user.id,
          })
        );
      }
    });

    await Promise.all(comments);
    console.log(`${comments.length} fake comments generated!`);

    console.log("COMPLETE!!");
  } catch (err) {
    console.log(err);
  }
};

module.exports = { generateFakeData };