<template>
  <div class="chat-room-wrapper mt-4">
    <div class="chat-room-content">
      <v-layout>
        <v-flex xs10 sm8 md8>
          <v-card class="chat-message-card">
            <v-list two-line>
              <div class="mt-3">
                <h1 class="text-xs-center">
                  {{room.title}}
                  <small>({{room.users.length.toLocaleString()}})</small>
                  <v-btn large color="red lighten-1" dark flat @click.prevent="leaveRoom">
                    <v-icon dark cneter>cancel</v-icon>나가기
                  </v-btn>
                </h1>
              </div>
              <div class="chat-messages mt-2">
                <div class="chat-message" v-for="(message, index) in messages" :key="index">
                  <v-list-tile @click="joinRoom(item)">
                    <v-list-tile-content>
                      <v-list-tile-title>
                        {{message.user.userId}} &nbsp;
                        <small>{{ toDate(message.createdAt)}}</small>
                      </v-list-tile-title>
                      <v-list-tile-sub-title>
                        <div v-show="message.image">
                          <img :src="message.image" alt width="100" height="60">
                        </div>
                        <span>{{message.message}}</span>
                      </v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider inset></v-divider>
                </div>
              </div>
            </v-list>
          </v-card>
        </v-flex>

        <v-flex xs2 sm4 md4>
          <v-card>
            <v-list>
              <div class="chat-list-title mt-3">
                <h2 class="text-xs-center">접속자</h2>
              </div>
              <div class="mt-2">
                <div class="chat-users">
                  <div class="chat-user" v-for="(item, index) in room.users" :key="index">
                    <v-list-tile>
                      <v-list-tile-content>
                        <v-list-tile-title class="text-xs-left">{{item.userId}}</v-list-tile-title>
                      </v-list-tile-content>
                    </v-list-tile>
                    <v-divider inset></v-divider>
                  </div>
                </div>
              </div>
            </v-list>
          </v-card>
        </v-flex>
      </v-layout>
    </div>

    <div class="chat-form mt-3">
      <v-layout>
        <v-flex xs10 sm8 md8>
          <v-card>
            <v-card-title primary-title>
              <div class="userId">
                <h3 class="headline mb-0">{{user.userId}}</h3>
              </div>
            </v-card-title>

            <div class="chat-form-content">
              <v-text-field
                v-model.trim="message"
                ref="message"
                label="메세지"
                @keydown.enter="sendMessage"
              >
                <template v-slot:append>
                  <v-btn class="mx-0" color="red lighten-2" flat @click.prevent="sendMessage">
                    <v-icon dark cneter>edit</v-icon>작성
                  </v-btn>
                </template>
              </v-text-field>
            </div>
            <div class="send-image">
              <v-icon color="indigo" large>add_photo_alternate</v-icon>
              <input type="file" id="image" @change="onFileSelected">
              <v-btn small @click.prevent="onImageUpload" color="primary" dark>이미지 전송</v-btn>
            </div>
          </v-card>
        </v-flex>
        <v-flex xs2 sm4 md4>
          <v-card>
            <v-btn small color="red lighten-1" dark flat @click="fetchInvitableUserList">
              <v-icon dark cneter>mail</v-icon>사용자초대
            </v-btn>
            <div v-if="checkFlag">
              <span v-if="invitableUserList.length<1">초대가능 유저가 없습니다.</span>
              <ul>
                <li v-for="(item, index) in invitableUserList" :key="index">
                  <div v-if="user.socketId !== item.socketId">
                    <a href @click.prevent="inviteUser(item.userId, item.socketId)">
                      <span>{{item.userId}}</span>
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </v-card>
        </v-flex>
      </v-layout>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  name: "ChatRoom",
  data() {
    return {
      message: "",
      selectedFile: null,
      checkFlag: false
    };
  },
  computed: {
    ...mapState({
      room: state => state.chat.room,
      messages: state => state.chat.room.messages,
      user: state => state.chat.user,
      invitableUserList: state => state.chat.invitableUserList
    })
  },
  created() {},
  mounted() {
    this.$refs.message.focus();
  },
  methods: {
    ...mapMutations(["SET_ROOM"]),
    ...mapActions([
      "LEAVE_ROOM",
      "SEND_MESSAGE",
      "SEND_IMAGE",
      "FETCH_INVITABLE_USER_LIST",
      "INVITE_USER"
    ]),

    toDate(date) {
      return !date ? "" : moment(date).format("YYYY-MM-DD(ddd) hh:mm a");
    },
    sendMessage(e) {
      if (!this.message) return;
      this.SEND_MESSAGE({ message: this.message });
      this.message = "";
    },
    leaveRoom() {
      this.LEAVE_ROOM();
    },
    onFileSelected(event) {
      this.selectedFile = event.target.files[0];
    },
    onImageUpload() {
      if (!this.selectedFile) return;
      const fd = {
        name: this.selectedFile.name,
        image: this.selectedFile,
        size: this.selectedFile.size
      };

      const validImageExt = ["jpeg", "jpg", "gif", "png", "bmp"];
      const MAX_SIZE = 5 * 1024 * 1024; // 5MB
      const fileExt = fd.name
        .substring(fd.name.lastIndexOf(".") + 1)
        .toLowerCase();

      // 확장자 체크
      if (validImageExt.indexOf(fileExt) < 0) {
        alert("이미지 파일만 가능합니다.");
        return;
      }

      // 파일 크기 체크
      if (fd.size > MAX_SIZE) {
        alert("첨부는 5MB 이내로 가능합니다.");
        return;
      }
      this.SEND_IMAGE(fd);
    },
    fetchInvitableUserList() {
      this.checkFlag = true;
      this.FETCH_INVITABLE_USER_LIST({ roomId: this.room.id });
    },
    inviteUser(userId, socketId) {
      if (!window.confirm(`${userId}님을 초대하시겠습니까?`)) return;
      this.INVITE_USER({ socketId, roomId: this.room.id });
      this.checkFlag = false;
    }
  }
};
</script>

<style>
.chat-room-content {
  width: 800px;
}

.chat-messages {
  height: 450px;
  overflow-y: scroll;
  padding: 5px 10px;
}
.chat-message {
  margin: 5px 10px;
}
.chat-users {
  height: 450px;
  overflow-y: scroll;
  padding: 5px 10px;
}
.chat-user {
  margin: 10px 20px;
}
.chat-form-content {
  padding: 0 20px;
}
.send-image {
  padding: 10px 20px;
}
</style>
