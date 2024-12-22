import { defineStore } from "pinia";
import axiosInstance from "@/axios";
export const useOrderStore = defineStore ('orderStore',{
    state:() => ({
        orders:[],
        loading : false,
        pagination:{
            currentPage: 1, // Default page is 1
            perPage: 5, // Default items per page
            totalItems: 6, // To store total items (useful for pagination)
            lastPage: 2,}

    }),
    actions:{
        async fetchOrders(currentPage){
            this.loading = true ;
            try {
                const response = await axiosInstance.get(`/admin/orders`,{
                    params:{
                        page : currentPage,
                    
                    }
                }

                );
                this.pagination.currentPage = response.data.pagination.currentPage;
                this.pagination.lastPage = response.data.pagination.lastPage;
                this.pagination.totalItems = response.data.pagination.totalItems;
                this.pagination.perPage = response.data.pagination.perPage;
                console.log(response.data.data);
                console.log('perpage',this.pagination.perPage);
                console.log('current',this.pagination.currentPage);
                console.log('last',this.pagination.lastPage);
                console.log('total',this.pagination.totalItems);

                console.log(response);
                this.orders=response.data.data || [];   
                console.log(response)
            } catch (error) {
                console.error(error);
            }
        },
        async updateOrder(orderId){
            try {
                const response = await axiosInstance.post(`/admin/orders/${orderId}/update-order`);
                console.log(response)
                console.log(this.orders.status);
            } catch (error) {
                console.error(error)
            }
            
        },
        async deleteOrder(orderId){
            try {
                const response = await axiosInstance.post(`/admin/orders/${orderId}/delete`);
                console.log(response)
            } catch (error) {
                console.error(error);
            }
        }
    }
})