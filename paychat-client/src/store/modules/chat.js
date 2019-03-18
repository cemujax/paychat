import io from "socket.io-client";
const BASE_URL = "http://localhost:3000";
const socket = io(BASE_URL);

const state = {
  user: {},
  invitableUserList: [], // 초대가능한 유저 리스트
  rooms: [], // 채팅방
  room: {}, // 참가중인 채팅방
  joinedRoomId: null // 참가중인 채팅방 아이디
};

const getters = {
  // 채팅 참여중인지
  isJoinedRoom(state) {
    return !!state.joinedRoomId;
  }
};

const mutations = {
  SET_USER(state, user) {
    state.user = user;
  },
  SET_INVITABLE_USER_LIST(state, invitableUserList) {
    state.invitableUserList = invitableUserList;
  },
  SET_ROOMS(state, rooms) {
    state.rooms = rooms;
  },
  SET_ROOM(state, room) {
    if (room) {
      room.messages.forEach(message => {
        if (message.image && typeof message.image === "object") {
          var arrayBufferView = new Uint8Array(message.image);
          var blob = new Blob([arrayBufferView], { type: "image/jpeg" });
          var urlCreator = window.URL || window.webkitURL;
          var imageUrl = urlCreator.createObjectURL(blob);
          message.image = imageUrl;
        }
      });
    }
    state.room = room;
  },
  SET_JOINED_ROOM_ID(state, joinedRoomId) {
    state.joinedRoomId = joinedRoomId;
  }
};

// 사용자 초대
socket.on("invitedRoom", room => {
  socket.emit("joinRoom", room.id);
});

const actions = {
  // 로그인
  LOGIN({ commit, state }, { userId }) {
    socket.emit("login", userId);

    socket.once("logined", ({ user }) => {
      commit("SET_USER", user);
    });
  },

  // 채팅 리스트 접속
  JOIN_CHAT_LIST({ commit }, _) {
    socket.emit("joinChatList");

    socket.on("rooms", rooms => {
      commit("SET_ROOMS", rooms);
    });

    socket.once("procRoom", room => {
      commit("SET_JOINED_ROOM_ID", room.id);
      commit("SET_ROOM", room);

      socket.on("procRoom", room => {
        commit("SET_ROOM", room);
      });
    });
  },
  // 채팅 리스트 나감
  LEAVE_CHAT_LIST({ commit }, _) {
    socket.emit("leaveChatList");
    socket.off("rooms");
  },

  // 채팅방 접속
  JOIN_ROOM({ commit }, { room }) {
    socket.emit("joinRoom", room.id);

    socket.once("procRoom", room => {
      commit("SET_JOINED_ROOM_ID", room.id);
      commit("SET_ROOM", room);

      socket.on("procRoom", room => {
        commit("SET_JOINED_ROOM_ID", room.id);
        commit("SET_ROOM", room);
      });
    });
  },

  // 채팅방 나가기
  LEAVE_ROOM({ commit }) {
    socket.emit("leaveRoom");
    socket.off("procRoom");
    commit("SET_JOINED_ROOM_ID", null);
    // commit("SET_ROOM", {});
  },

  // 텍스트 메세지 전송
  SEND_MESSAGE({ commit, state }, { message }) {
    socket.emit("sendMessage", { id: state.joinedRoomId, message });
  },

  // 이미지 전송
  SEND_IMAGE({ commit, state }, fd) {
    socket.emit("sendImage", { id: state.joinedRoomId, fd });
  },

  // 초대가능 유저 리스트 조회
  FETCH_INVITABLE_USER_LIST({ commit, state }, { roomId }) {
    socket.emit("fetchInvitableUserList", roomId);

    socket.on("invitableUserList", invitableUserList => {
      commit("SET_INVITABLE_USER_LIST", invitableUserList);
    });
  },

  // 사용자 초대
  INVITE_USER({ commit }, { socketId, roomId }) {
    socket.emit("inviteUser", { socketId, roomId });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
