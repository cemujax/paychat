<template>
  <v-app>
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs8 sm8 md4>
            <LoginForm @onSubmit="onLogin"/>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapActions } from "vuex";

import LoginForm from "@/components/LoginForm.vue";

export default {
  name: "MainView",
  components: { LoginForm },
  data() {
    return {};
  },
  created() {},
  methods: {
    ...mapActions(["LOGIN"]),

    onLogin(userId) {
      this.LOGIN({ userId });
    }
  }
};
</script>

<style>
</style>
