import { defineStore } from 'pinia';
import axiosInstance from '@/axios';
import { useToast } from 'vue-toastification';

export const useUserStore = defineStore('userStore', {
  state: () => ({
    users: [], // Stores the current page of users
    loading: false, // State for indicating loading status
    
    pagination: {
      total: 0, // Total number of users
      currentPage: 1, // Current page number
      lastPage: 1, // Total number of pages
      perPage: 5, // Number of users per page
     
    },
  }),

  actions: {
    
    // Fetch users with pagination
    async fetchUsers(currentPage, perPage,searchQuery = '') {
      const toast = useToast();
      this.loading = true;
      try {
        const response = await axiosInstance.get('/admin/users', {
          params: { page: currentPage, per_page: perPage ,search: searchQuery,},
        });
    
        console.log(response); // Add this to see the full response structure
    
        // Check if response.data exists and has the expected structure
        if (response.data && response.data.data && response.data.pagination) {
          const { data, pagination } = response.data;
    
          console.log('Fetched Users:', data);  // Log the fetched users
          console.log('Pagination:', pagination);  // Log the pagination info
    
          // Update users and pagination based on the response
          this.users = data;
         
          this.pagination = {
            total: pagination.total,
            currentPage: pagination.currentPage,
            lastPage: pagination.lastPage,
            perPage: pagination.perPage,
          };
        } else {
          throw new Error('Invalid response structure');
        }
      } catch (error) {
        toast.error('Error fetching users:', error);
      } finally {
        this.loading = false;
      }
    }
    ,

    

    // Block a user
    async blockUser(userId) {
      const toast = useToast();
      try {
        await axiosInstance.post(`/admin/users/${userId}/block`);
        // Refresh the user list after blocking
        await this.fetchUsers(this.pagination.currentPage, this.pagination.perPage);
      } catch (error) {
        toast.error('Error blocking user:', error);
      }
    },

    // Unblock a user
    async unblockUser(userId) {
      const toast = useToast();
      try {
        await axiosInstance.post(`/admin/users/${userId}/active`);
        // Refresh the user list after unblocking
        await this.fetchUsers(this.pagination.currentPage, this.pagination.perPage);
      } catch (error) {
        toast.error('Error unblocking user:', error);
      }
    },

    // Delete a user
    async deleteUser(userId) {
      const toast = useToast();
      try {
        await axiosInstance.post(`/admin/users/${userId}/delete`);
        // Refresh the user list after deletion
        await this.fetchUsers(this.pagination.currentPage, this.pagination.perPage);
      } catch (error) {
        toast.error('Error deleting user:', error);
      }
    },
  },
});
