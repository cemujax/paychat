<template>
  <v-app>
    <v-content>
      <v-container fluid fill-height>
        <v-layout justify-center>
          <!-- <v-flex xs10 sm8 md5> -->
          <ChatRoom/>
          <!-- </v-flex> -->
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import ChatRoom from "@/components/ChatRoom.vue";

export default {
  name: "ChatRoomView",
  components: { ChatRoom },
  data() {
    return {};
  }
};
</script>

<style>
</style>

