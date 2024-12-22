<template>
  <v-container class="sign_in">
    <navBar/>
    <v-card class="pa-5" max-width="500">
      <v-card-title>Sign In</v-card-title>
      <v-card-text>
        
          <v-text-field label="Email" 
          type="email" 
          v-model="email"
          :rules="emailRules" 
          
          ></v-text-field>
          <v-text-field label="Password" 
          type="password" 
          v-model="password"
          :rules="passwordRules"
          ></v-text-field>
          <v-btn class="mt-4" color="primary" block @click="handleSignIn" >Sign In</v-btn>
          <router-link to="./forget_password" class="forget">forget password</router-link>
          <VSpacer/>
          
        
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>

import NavBar from '@/components/navBar.vue';
import {useAuthStore} from '../stores/authStore';
import { useToast } from 'vue-toastification';


export default {
    components:{NavBar},
name:'sign_in',
data(){
    return{
        email : '',
        password : '',
        emailRules: [
        v => !!v || 'Email is required',
        v => /.+@.+\..+/.test(v) || 'Please enter a valid email address',
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => v.length >= 6 || 'Password must be at least 6 characters long',
      ],
       
    };
},
methods : {
    async handleSignIn(){
      const toast = useToast();
      console.log("Email:", this.email, "Password:", this.password);
      const router =this.$router;
        try{
            const authStore = useAuthStore();
              await authStore.signin({
                email : this.email,
                password : this.password,
            });
        
             
            
                  router.push('/admin_panel')//should modified
                
                
            

           

        }catch(error){
            toast.error("failed to signin ",error);
        }
        
    }
}
}
</script>

<style>
.sign_in {
    margin-top: 250px;
    margin-left: 500px;
}
.forget{
    text-decoration: none;
    

}
</style>