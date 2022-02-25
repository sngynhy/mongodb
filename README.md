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

2/25
- index를 이용하여 빠르게 데이터 탐색
- blog 페이징 처리 => blogRoute get 함수 코드 추가
    .find() -> .sort() -> <여기서 pagination 처리> .skip().limit()
    
    <페이징 처리 개선>
    생성 시간 순으로 정렬하고 pagination을 적용한다고 했을 때 예시)
    일단 _id는 기본으로 인덱스가 걸려 있고 해당 인덱스는 생성시간 순으로 나열이 되어 있다. (ObjectId에 timestamp가 포함되어 있기 때문)

    일반적인 방법:

    page1: model.find().skip(0).limit(10)
    page2: model.find().skip(10).limit(10)
    page3: model.find().skip(20).limit(10)

    뒤로 갈수록 skip을 많이 해야되서 조금씩 느려짐

    page1: model.find().imit(10)
    page2: model.find({_id: { $gt: last_id }}).limit(10)
    page3: model.find({_id: { $gt: last_id }}).limit(10)

    이런식으로 하게 되면 skip을 할 필요가 없어지기 때문에
    전 페이지의 마지막 문서의 _id를 GET API에 같이 보내주면
    인덱스로 빠르게 탐색하고 다음 페이지의 문서들을 빠르게 호출할 수 있게 된다.