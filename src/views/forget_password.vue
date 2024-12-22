<template>
  <v-container class="forget_password">
    <v-card class="pa-5" max-width="500">
      <v-card-title>Forgot Password</v-card-title>
      <v-card-text>
        <v-text-field
          label="Email"
          type="email"
          v-model="email"
          
        ></v-text-field>
        <v-btn
          class="mt-4"
          color="primary"
          block
          @click="handleForgotPassword"
          :loading="loading"
          :disabled="loading"
        >
          Send Reset Link
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { useAuthStore } from '@/stores/authStore';
import { useToast } from 'vue-toastification';
export default {
  name: 'ForgetPassword',
  data() {
    return {
      loading:false,
      email: '',
      emailRule :[
        v => !!v || 'email is required',
        v => /.+@.+\..+/.test(v) || 'Please enter a valid email address',
      ]
    };
  },
  methods: {
    async handleForgotPassword() {
      const toast = useToast();
      this.loading=true;
      try {
        const authStore = useAuthStore();
        await authStore.requestPasswordReset(this.email); 
      } catch (error) {
        toast.error('cant send reset link virify the inputs ')
        console.error('Error sending password reset link:', error);
        
      }
      this.loading=false
    },
  },
};
</script>

<style>
.forget_password {
  margin-top: 250px;
  margin-left: 500px;
}
</style>
