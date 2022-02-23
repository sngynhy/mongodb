const faker = require("faker");
const { User, Blog, Comment } = require("./src/models");
                        // 총 유저의 수, 유저별 블로그 수, 유저별 코멘트 수
generateFakeData = async (userCount, blogsPerUser, commentsPerUser) => {
  if (typeof userCount !== "number" || userCount < 1)
    throw new Error("userCount must be a positive integer");
  if (typeof blogsPerUser !== "number" || blogsPerUser < 1)
    throw new Error("blogsPerUser must be a positive integer");
  if (typeof commentsPerUser !== "number" || commentsPerUser < 1)
    throw new Error("commentsPerUser must be a positive integer");
  const users = [];
  const blogs = [];
  const comments = [];
  console.log("Preparing fake data.");

  // faker 모듈을 이용하여 랜덤 데이터 생성
  //  User 데이터 생성
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

  // Blog 데이터 생성
  users.map((user) => {
    for (let i = 0; i < blogsPerUser; i++) {
      blogs.push(
        new Blog({
          title: faker.lorem.words(),
          content: faker.lorem.paragraphs(),
          islive: true,
          user,  // mongoose가 알아서 user의 _Id로 저장
        })
      );
    }
  });

  // Comment 데이터 생성
  users.map((user) => {
    for (let i = 0; i < commentsPerUser; i++) {
      let index = Math.floor(Math.random() * blogs.length);  // blog index
      comments.push(
        new Comment({
          content: faker.lorem.sentence(),
          user,
          blog: blogs[index]._id,  
        })
      );
    }
  });

  console.log("fake data inserting to database...");
  await User.insertMany(users);
  console.log(`${users.length} fake users generated!`);
  await Blog.insertMany(blogs);
  console.log(`${blogs.length} fake blogs generated!`);
  await Comment.insertMany(comments);
  console.log(`${comments.length} fake comments generated!`);
  console.log("COMPLETE!!");
};

module.exports = { generateFakeData };