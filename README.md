# mongodb

2/22

- blog, user, comment CRUD 기능

2/23

- blog(상위) collection에 user/comment(하위) 데이터를 내장하여 저장하기
- comment POST API 수정, PATCH/DLELETE API 추가
- user PUT/DELETE API 수정

> userRoute.js - PUT 코드 수정 필요
> Blog.js - comments: [CommentSchema] 부분 수정 필요 (구글링해보기)

2/24
- comment 삭제 시 blog comments 목록에서 해당 comment 삭제 처리
- user 삭제 시 blog user 목록에서 해당 user의 blog, comment 삭제 처리

> userRoute.js - PUT Blog.updateMany 코드 수정 필요
(userFullName 변경 시 blog collection의 comments > comment들의 userFullName udpate)
> commentRoute.js - PATCH Blog.updateOne 부분 수정 필요 (content를 못찾음)