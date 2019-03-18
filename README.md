# Pay Chat

채팅 어플리케이션 사전과제

기능

- ID를 입력하여 접속
- 채팅방 리스트에서 채팅방을 선택하여 채팅방 접속
- 채팅방에서 다른 사용자를 초대
- 채팅방에서 텍스트 메세지 전송
- 채팅방에서 이미지 전송

## 문제해결 전략

web socket 양방향 통신을 위해 socket.io를 사용해 하나의 클라이언트 또는 다수 클라이언트에 이벤트를 보내고 받습니다.

1. 접속 시 입력한 ID 외에 접속자 정보에 **socket id**를 별도로 저장합니다.
2. 채팅방 리스트는 Namespace의 하위인 **Room단위**로 구분되며 채팅방 입장 후 텍스트 메세지, 이미지 전송 시 해당 Room의 접속자들에게만 이벤트를 전송합니다.
3. **사용자 초대할 유저의 socket id**에 채팅방 접속 이벤트를 보내 사용자를 초대합니다.
4. 이미지는 별도로 저장하지 않으며 **ArrayBuffer**로 서버와 클라이언트간에 송수신하며 클라이언트에서 Blob객체로 url을 생성해 DOM에 매핑합니다.

## 기술스택

- Node.js
- Express
- Socket.io
- Vue.js
- Vuex
- Vuetify

## 프로젝트 빌드

1. Clone the repository

   ```bash
   $ git clone https://github.com/cemujax/paychat.git
   ```

2. Install dependences

   ```bash
   $ npm run build
   ```

## 프로젝트 실행

```bash
$ npm run start
```

> 실행 후 http://localhost:3000/ 접속

## 스크린샷

![접속화면](https://raw.githubusercontent.com/cemujax/paychat/master/images/pay%20chat-1.jpg)

![채팅방 리스트](https://raw.githubusercontent.com/cemujax/paychat/master/images/pay%20chat-2.jpg)

![채팅방](https://raw.githubusercontent.com/cemujax/paychat/master/images/pay%20chat-3.jpg)
