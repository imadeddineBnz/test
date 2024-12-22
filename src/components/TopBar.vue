<template>
    <v-app-bar app>
      <v-btn icon @click="$emit('toggleDrawer')">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
      <v-app-bar-title @click="redirect">Admin Panel</v-app-bar-title>
      <v-spacer></v-spacer>
      <span @click="handleLogout">logout</span>
      <v-btn icon @click="handleLogout">
      <v-icon>mdi-logout</v-icon>
    </v-btn>
    </v-app-bar>
  </template>
  
  <script>

import { useAuthStore } from '@/stores/authStore'; 


export default {
  methods: {
    handleLogout() {
      const authStore = useAuthStore();
      authStore.logout(); 
      this.$router.push('/sign_in');
    },
    redirect(){
      
      this.$router.push('/admin_panel');
    }
  },
};
</script>



<style>
span{
  cursor: pointer;
}
v-app-bar-title :hover{
  cursor: pointer;
}
</style>