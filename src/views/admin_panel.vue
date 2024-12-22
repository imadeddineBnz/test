<template>
  <v-app>
    <!-- Top Bar -->
    <TopBar @toggleDrawer="drawer = !drawer" />

    <!-- Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
    >
      <v-list dense>
        <v-list-item-group active-class="primary--text">
          <v-list-item v-for="(item, index) in items" :key="index" :to="item.link">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <v-container>
        <v-row justify="center" >
          <!-- Loop through the items and display large icons with clickable functionality -->
          <v-col
            v-for="(item, index) in items"
            :key="index"
            cols="12" sm="4" md="3"
            class="d-flex justify-center align-center"
          >
            <v-btn
              :to="item.link"
              elevation="4"
              class="ma-4"
              large
              fab
              color="primary"
            >
              <v-icon>{{ item.icon }}</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>

import TopBar from '@/components/TopBar.vue';
import pusher from '@/main';
import { useAuthStore } from '@/stores/authStore';


export default {
  components: { TopBar },
  data() {  
    return {
      drawer: false, // State to toggle the navigation drawer
      items: [
        { title: 'Products', icon: 'mdi-view-dashboard', link: '/product_page' },
        { title: 'Users', icon: 'mdi-account-multiple', link: '/clients_page' },
        { title: 'Orders', icon: 'mdi-chart-bar', link: '/orders_page' },
        { title: 'admin panel', icon: 'mdi-chart-bar', link: '/admin_panel' },
      ],
    };
  },
  mounted(){
    
    
    
    const auth= useAuthStore();
    const channel = pusher.subscribe('originova-channel');
    console.log('Subscribed to channel: originova-channel',channel);
    console.log(useAuthStore.authName)
    if(!(auth.name == 'redouane')){
      channel.bind('user-logout', (data) => {
      console.log('event received:',data);
      
        auth.logout();
        window.location.href = '/Sign_in';

    });
    }

    }

    
  
};
</script>

<style>
/* You can adjust styling here */
</style>