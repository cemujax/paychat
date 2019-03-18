const express = require("express");
const http = require("http");
const path = require("path");
const logger = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");

const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);

const rooms = require("./data/rooms");
const userList = []; // 접속 유저

if (process.env.NODE_ENV !== "production") app.use(cors());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../paychat-client", "dist")));

io.on("connection", socket => {
  console.log(`A user connected with socket id ${socket.id}`);
  const user = {};

  // 로그인
  socket.on("login", userId => {
    const socketId = socket.id;
    user.userId = userId;
    user.socketId = socketId;
    userList.push({ userId, socketId });

    socket.emit("logined", { user });
  });

  // 초대가능 사용자 조회
  socket.on("fetchInvitableUserList", roomId => {
    const room = rooms.find(r => r.id === roomId);
    let invitableUserList = [];
    if (room) {
      const socketIds = room.users.map(u => u.socketId);
      invitableUserList = userList.filter(
        user => !socketIds.includes(user.socketId)
      );
    }
    socket.emit("invitableUserList", invitableUserList);
  });

  // 채팅 리스트 접속
  socket.on("joinChatList", () => {
    socket.join("chatList", () => {
      socket.emit("rooms", rooms);
    });
  });

  // 채팅 리스트 나감
  socket.on("leaveChatList", () => {
    socket.leave("chatList");
  });

  // 채팅방 접속
  socket.on("joinRoom", roomId => {
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      if (!room.users.find(u => u.userId === user.userId)) {
        room.users.push(user);
      }
    }

    socket.join(room.id, () => {
      socket.emit("procRoom", room);
      socket.to(room.id).emit("procRoom", room);
      socket.to("chatList").emit("rooms", rooms);
    });
  });

  // 사용자 초대
  socket.on("inviteUser", ({ socketId, roomId }) => {
    // 초대한 사용자
    const inviteUser = userList.find(u => u.socketId === socketId);
    if (!inviteUser) return;

    const room = rooms.find(r => r.id === roomId);
    if (room) {
      room.users.push(inviteUser);
    }

    // 초대 사용자한테
    socket.to(socketId).emit("invitedRoom", room);
    socket.emit("procRoom", room);
    socket.to(roomId).emit("procRoom", room);
  });

  const leaveRoomHandler = () => {
    let userIndex = -1;

    const room = rooms.find(r => {
      userIndex = r.users.findIndex(u => u.userId === user.userId);
      return userIndex != -1;
    });

    if (room) {
      room.users.splice(userIndex, 1); // room에서 해당 user 삭제
      socket.leave(room.id, () => {
        socket.to(room.id).emit("procRoom", room);
      });
    }
    socket.to("chatList").emit("rooms", rooms);
  };

  // 채팅방 나가기
  socket.on("leaveRoom", leaveRoomHandler);

  // 접속 종료
  socket.on("disconnect", () => {
    leaveRoomHandler();
    let userIndex = -1;
    if (user) {
      userIndex = userList.findIndex(u => u.socketId === user.socketId);
      if (userIndex > -1) {
        userList.splice(userIndex, 1);
      }
    }
  });

  // 텍스트 메세지 전송
  socket.on("sendMessage", data => {
    const { id, message } = data;
    const room = rooms.find(r => r.id == id);

    if (room) {
      const msg = {
        id: (room.messages[room.messages.length - 1] || { id: 0 }).id + 1,
        user,
        message,
        image: null,
        createdAt: new Date()
      };
      room.messages = room.messages.slice(-9).concat(msg);
    }

    socket.emit("procRoom", room);
    socket.to(id).emit("procRoom", room);
  });

  // 이미지 전송
  socket.on("sendImage", data => {
    const { id, fd } = data;

    const room = rooms.find(r => r.id == id);
    if (room) {
      const msg = {
        id: (room.messages[room.messages.length - 1] || { id: 0 }).id + 1,
        user,
        message: "",
        image: fd.image,
        createdAt: new Date()
      };
      room.messages = room.messages.slice(-9).concat(msg);
    }

    socket.emit("procRoom", room);
    socket.to(id).emit("procRoom", room);
  });
});

app.use((err, req, res, next) => {
  console.error("Error on request %s %s", req.method, req.url);
  console.error(err.stack);
  res.status(500).send("Server error");
});

server.listen(port, function() {
  console.log(`Server Running Port:${port}`);
});
