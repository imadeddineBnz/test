<template>
    <v-app-bar app>
      <v-toolbar-title> Store</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn to="/sign_in" variant="flat">
        Sign In
      </v-btn>
      <v-btn to="/sign_up" variant="flat">
        Sign Up
      </v-btn>
    </v-app-bar>
  </template>
  
  <script>
  export default {
    name: 'navBar',
  };
  </script>
  
<style scoped>
v-btn {
  margin-right: 10px;
}
</style>