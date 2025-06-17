# Node.js_sprint1

## 1. Product 클래스와 ElectronicProduct 클래스 제작
  
### Product 클래스
- `name`, `description`, `pricce`, `tags`, `images`, `favoriteCount` 프로퍼티를 가진다.
- `favorite` 메소드를 가진다.
- `favoritae` 메소드가 호출될 경우 찜하기 수가 1 증가한다.

### ElectronicProduct 클래스
- `Product` 클래스를 상속한다.
- 추가로 `manufacturer` 프로퍼티를 가진다.  

------------------------------------------------------------------------

## 2. Article 클래스 제작

### Article 클래스
- `title`, `content`, `writer`, `likeCount` 프로퍼티를 가진다.
- `like` 메소드를 가진다.
- `like` 메소드가 호출될 경우 좋아요 수가 1 증가한다.

> 각 클래스마다 constructor를 작성
>
> 추상화/캡슐화/상속/다형성을 고려하여 코드를 작성

------------------------------------------------------------------------

## 3. [Article API](https://panda-market-api-crud.vercel.app/docs) 를 이용하여 함수 구현

#### getArticleList()
- **GET 메소드를 사용**
- `page`, `pageSize`, `keyword` 쿼리 파라미터를 이용한다.
#### getArticle()
- **GET 메소드를 사용**
#### createArticle()
- **POST 메소드를 사용**
- request body에 `title`, `content`, `image` 를 포함한다.
#### patchArticle()
- **PATCH 메소드를 사용**
#### deleteArticle()
- **DELETE 메소드를 사용**
  
> `fetch` 혹은 `axios`를 이용한다.
>
> 응답의 상태코드가 2XX가 아닐경우, 에러 메시지를 콘솔에 출력한다.
>
> `.then()` 메소드를 이용하여 비동기 처리를 한다.
>
> `.catch()` 를 이용하여 오류 처리를 한다.

------------------------------------------------------------------------

## 4. [Product API](https://panda-market-api-crud.vercel.app/docs) 를 이용하여 함수 구현

#### getProductList()
- **GET 메소드를 사용**
- `page`, `pageSize`, `keyword` 쿼리 파라미터를 이용한다.
#### getProduct()
- **Get 메소드를 사용**
#### createProduct()
- **POST 메소드를 사용**
- request body에 `name`, `description`, `price`, `tags`, `images` 를 포함한다.
#### patchProduct()
- **PATCH 메소드를 사용**
#### deleteProduct()
- **DELETE 메소드를 사용**

> `async/await` 을 이용하여 비동기 처리를 한다.
>
> `try/catch` 를 이용하여 오류 처리를 한다.

---------------------------------------------------------------------------

## 5. 받아온 상품 리스트를 저장

`getProductList()` 를 통해 받아온 상품 리스트를 각각 인스턴스로 만들어 `product` 배열에 저장한다.

> 해시태그에 **"전자제품"**이 포함되어있는 상품들은 `Product`클래스가 아닌 `ElectronicProducst` 클래스로 인스턴스 생성
>
> 그 외 상품들은 모두 `Product` 클래스로 인스턴스 생성

------------------------------------------------------------------------

## 6. 함수 모둘화

`ProductService.js` 파일에는 **Product API 관련 함수**들을 작성한다.

`ArticleService.js` 파일에는 **Article API 관련 함수**들을 작성한다.

이외의 모든 코드들은 `main.js` 파일에 작성한다.

------------------------------------------------------------------------

## 7. 심화 요구사항

Article 클래스에 `createdAt`생성일자 프로퍼티를 만든다.
- `createdAt` : 새로운 객체가 생성되어 constructor가 호출될 시 `createdAt`에 현재 시간을 저장한다.
