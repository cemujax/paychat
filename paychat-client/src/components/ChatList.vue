<template>
  <div class="chat-list">
    <v-card>
      <v-list two-line>
        <div class="chat-list-title mt-3">
          <h1 class="text-xs-center">채팅방</h1>
        </div>
        <div class="mt-2">
          <div class="chat-room" v-for="(item, index) in rooms" :key="index">
            <v-list-tile @click="joinRoom(item)">
              <v-list-tile-action>
                <v-icon color="indigo">chat</v-icon>
              </v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-title>{{item.title}} ({{item.users.length.toLocaleString()}})</v-list-tile-title>
                <v-list-tile-sub-title></v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider inset></v-divider>
          </div>
        </div>
      </v-list>
    </v-card>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "ChatList",
  data() {
    return {
      loading: false
    };
  },
  created() {
    this.fetchRooms();
  },
  computed: mapState({
    user: state => state.chat.user,
    rooms: state => state.chat.rooms
  }),
  methods: {
    ...mapActions(["JOIN_CHAT_LIST", "LEAVE_CHAT_LIST", "JOIN_ROOM"]),

    fetchRooms() {
      this.loading = true;
      this.JOIN_CHAT_LIST().finally(_ => {
        this.loading = false;
      });
    },
    joinRoom(room) {
      this.LEAVE_CHAT_LIST();
      this.JOIN_ROOM({ room });
    }
  }
};
</script>

<style>
.chat-list {
  margin-top: 10%;
}
.chat-room {
  margin: 30px 50px 30px 50px;
}
</style>
