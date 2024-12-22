import { defineStore } from 'pinia';
//import axios from 'axios';
import axiosInstance from '@/axios';
import { useToast } from 'vue-toastification';


export const useAuthStore = defineStore('auth',{
    id: 'user',
    state: ()=>({
        userId:localStorage.getItem('userId') || null,
        authToken : localStorage.getItem('authToken')||null,
        authName : localStorage.getItem('authName') || null,

    }),
    //pinia persistance
    actions : {
        async signin({email,password}){
          const toast = useToast();
            console.log("Attempting login with:", { email, password });
            try{
              
                const response = await axiosInstance.post('/admin/login',{email,password});
                if(response.data.message === 'You have been blocked by the Administrator'){
                  toast.error('You have been blocked by the Administrator')
                }
                if(response && response.data.user){
                    console.log('res',response.data)
                this.userId = response.data.user.userId
                this.authToken = response.data.user.token
                this.name=response.data.user.name
                localStorage.setItem('userId',response.data.user.id)
                localStorage.setItem('authToken',response.data.user.token)
                localStorage.setItem('authName',response.data.user.name)
                console.log('Token being sent:', localStorage.getItem('authToken'));
                toast.success('login successfully ');
                }
              
               
                

            }catch(error){
               toast.error('failed to login ')
                console.error(error);
                
            }
        },
        async signup({name,email,password,password_confirmation}){
            try{
                const response = await axiosInstance.post('/admin/register',{name,email,password,password_confirmation})
                console.log('res',response.data)
                this.userId=response.data.userId
                this.authToken = response.data.authToken
            }catch(error){
                if (error.response) {
                    console.error('Error status:', error.response.status);
                    console.error('Error details:', error.response.data);
                    alert(`Signup failed: ${JSON.stringify(error.response.data.errors || error.response.data)}`);
                } else {
                    console.error('Unexpected error:', error);
                    alert('An unexpected error occurred.');
                }
            }
        },
        async requestPasswordReset(email) {
          const toast = useToast();
            try {
              const response = await axiosInstance.post('/admin/forgot-password', { email });
              console.log('Password reset email sent:', response.data);
              toast.success('Password reset link sent! Please check your email.');
            } catch (error) {
              if (error.response && error.response.status === 422) {
                toast.error('Error: Email not found.');
              } else {
                console.error('Password reset request error:', error);
                toast.error('An error occurred. Please try again.');
              }
            }
          },
      
          async resetPassword({ token, email, password, password_confirmation }) {
            const toast = useToast();
            try {
              const response = await axiosInstance.post('/admin/password-reset', {
                token ,
                email,
                password,
                password_confirmation,
              });
              console.log('Password reset successful:', response.data);
              toast('Password has been reset successfully! You can now log in.');
            } catch (error) {
              if (error.response && error.response.status === 422) {
                toast.error('Error resetting password. Please check your inputs.');
              } else {
                console.error('Password reset error:', error);
                toast.error('An error occurred. Please try again.');
              }
            }
          },
          logout() {
            
            this.userId = null;
            this.authToken = null;
            localStorage.removeItem('authToken'); // Clear token from storage
            localStorage.removeItem('userId');
            localStorage.removeItem('authName');
          },

    },
})