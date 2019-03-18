<template>
  <v-app>
    <v-content>
      <v-container fluid fill-height>
        <v-layout justify-center>
          <v-flex xs8 sm8 md4>
            <ChatList/>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import ChatList from "@/components/ChatList.vue";

export default {
  name: "ChatListView",
  components: { ChatList },
  data() {
    return {};
  }
};
</script>

<style>
</style>
