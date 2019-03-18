<template>
  <div id="app">
    <div v-if="!Object.keys(user).length">
      <MainView/>
    </div>
    <div v-else-if="!isJoinedRoom">
      <ChatListView/>
    </div>
    <div v-else>
      <ChatRoomView/>
    </div>
  </div>
</template>

<script>
import "vuetify/dist/vuetify.min.css";
import { mapState, mapGetters } from "vuex";
import MainView from "@/views/MainView";
import ChatListView from "@/views/ChatListView";
import ChatRoomView from "@/views/ChatRoomView";

export default {
  name: "App",
  components: { MainView, ChatListView, ChatRoomView },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      user: state => state.chat.user,
      room: state => state.chat.room,
      rooms: state => state.chat.rooms
    }),
    ...mapGetters(["isJoinedRoom"])
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
ul {
  list-style: none;
}
</style>
