<template>
    <v-container class="sign_up">
      <navBar/>
      <v-card class="pa-5" max-width="500">
        <v-card-title>Sign Up</v-card-title>
        <v-card-text>
          
            <v-text-field 
            label="Full Name" 
            v-model="name"
            :rules="Required"
            ></v-text-field>
            <v-text-field 
            label="Email"
             type="email" 
             v-model="email"
             :rules="Required"
             ></v-text-field>
            <v-text-field 
            label="Password" 
            type="password" 
            v-model="password"
            :rules="password_rule"
            ></v-text-field>
            <v-text-field 
            label="password_confirmation" 
            type="password" 
            v-model="password_confirmation"
            :rules="passwordC_rule"
            ></v-text-field>
            <v-btn class="mt-4" color="primary" block @click="handleSinup">Sign Up</v-btn>
            
          
        </v-card-text>
      </v-card>
    </v-container>
  </template>
  
  <script>
  import { useAuthStore } from '@/stores/authStore';
import navBar from '@/components/navBar.vue';
  export default {
    components:{navBar},
    name: 'Sign_up',
    data(){
      return{
        name:'',
        email:'',
        password:'',
        password_confirmation:'',
        errorMessage : '',
        Required:[
          v => !!v || 'this field is required'
        ],
        password_rule:[
          v => !!v || 'this field is required',
          v => v.length >= 6 || 'Password must be at least 6 characters long',
        ],
        passwordC_rule:[
          v => !!v || 'this field is required',
          v => v.length >= 6 || 'Password must be at least 6 characters long',
          v => v == this.password || 'password confirmatin must be the same as password '
        ]
      }
    },
    methods: {
     async handleSinup(){
      this.errorMessage='';
      console.log(this.password,this.password_confirmation)
     /* if(this.password !== this.password_confirmation){
        alert('the pasword confirmation doesnt match');
        return;
      }*/
      try{
      const authStore = useAuthStore();
      await authStore.signup({
        email : this.email,
        name : this.name,
        password : this.password,
        password_confirmation : this.password_confirmation
      })
    }catch (errors) {
            if (errors.email) {
                this.errorMessage = errors.email[0]; // Display email error
            } else if (errors.general) {
                this.errorMessage = errors.general; // Display unexpected error
            } else {
                this.errorMessage = 'An unknown error occurred.';
            }
        }
      },
    }}
    

  </script>
  
  <style>
  .sign_up {
    margin-top: 250px;
    margin-left: 500px;
  }
  </style>
  