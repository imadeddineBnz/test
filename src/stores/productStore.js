import { defineStore } from 'pinia';
import axiosInstance from '@/axios';

export const useProductStore = defineStore('productStore', {
  state: () => ({
    products: [],
    loading: false,
    pagination:{
      currentPage: 1, // Default page is 1
      perPage: 5, // Default items per page
      totalItems: 6, // To store total items (useful for pagination)
      lastPage: 2,}
  }),
  actions: {
    async fetchProducts(currentPage,searchQuery='') {
      
      
      try {
        const response = await axiosInstance.get(`/admin/products`, {
          params: {
            page: currentPage,
            search: searchQuery,
          },
        });
        
        this.products = response.data.data || [];
        this.pagination.lastPage = response.data.pagination.lastPage; 
        this.pagination.currentPage=response.data.pagination.currentPage;
        this.pagination.perPage=response.data.pagination.perPage;
        this.pagination.totalItems=response.data.pagination.total;
        console.log(response.data.data);
        console.log('perpage',this.pagination.perPage);
        console.log('current',this.pagination.currentPage);
        console.log('last',this.pagination.lastPage);
        console.log('total',this.pagination.totalItems);
        // Update last page
      } catch (error) {
        console.error('Cannot fetch products:', error);
      } finally {
        this.isSearching = false;
      }
    }
,    

    async createProduct(newProduct) {
      const formData = new FormData();
      formData.append('category_id', newProduct.category_id);
      formData.append('name', newProduct.name);
      formData.append('description', newProduct.description);
      formData.append('quantity', newProduct.quantity);
      formData.append('price', newProduct.price); 
      if (newProduct.image && newProduct.image.length > 0) {
        newProduct.image.forEach((file,) => {
          formData.append(`file`, file); // Append each file under the 'files[]' key
        });
      } else {
        console.warn("No files selected or image array is empty");
      }
      
      console.log(newProduct.category_id);
      console.log(newProduct.name);
      console.log(newProduct.description);
      console.log(newProduct.quantity);
      console.log(newProduct.price);
      console.log(newProduct.image);
      console.log(newProduct);
      formData.forEach((value, key) => { console.log(`${key}: ${value}`); });
    
      try {
        console.log('Submitting product:',newProduct); // Debug the form data
        const response = await axiosInstance.post(`admin/create-product`, formData);
        console.log('Product created:', response);
        
      } catch (error) {
        console.error('Error creating product:', error);
        throw error; // Allow the component to handle the error if needed
      }
    },    
    async deleteProduct(productId) {
      try {
        const response = await axiosInstance.post(`/admin/products/${productId}/delete-product`);
        console.log('Product deleted:', response);
        this.fetchProducts(this.currentPage,this.perPage);
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    },
  },
});
