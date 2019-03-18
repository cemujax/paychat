<template>
  <div class="login-form">
    <div class="text-xs-center">
      <img src="@/assets/pay-logo.jpg" alt="kakao" width="200" height="200">

      <v-text-field
        v-model="userId"
        ref="userId"
        label="Id를 입력해주세요"
        maxlength="20"
        @keyup.enter="onSubmit"
      ></v-text-field>
      <v-btn @click.prevent="onSubmit" color="primary" dark>접속</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginForm",
  props: [],
  data() {
    return {
      userId: ""
    };
  },
  mounted() {
    this.$refs.userId.focus();
  },
  methods: {
    onSubmit() {
      if (!this.userId) return;
      this.$emit("onSubmit", this.userId);
    }
  }
};
</script>

<style>
</style>
