<template>
<v-container>
  
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

 
    <!-- data table-->
    <v-data-table
    
    :headers="headers"
    :items="orderStore.orders"
    :loading="isSearching"
    no-data-text="no orders available"  
    item-key="id"
    hide-default-footer

    >
    <template v-slot:body="{ items }">
        <tr v-for="item in items" :key="item.id" >
          <td @click="dialog=true,selectOrder(item)">{{ item.id }}</td>
          <td @click="dialog=true,selectOrder(item)">{{ item.user.name }}</td>
          <td @click="dialog=true,selectOrder(item)">{{ item.user.email }}</td>
          <td @click="dialog=true,selectOrder(item)">{{ item.status }}</td>
          <td @click="dialog=true,selectOrder(item)">{{ item.price }}</td>
          <td>
            <v-btn @click="dialogDelete=true,selectOrder(item)" color="red" small>Delete</v-btn>
            <v-btn v-if="item.status === 'pending'"
          :color=" 'green'"
          small
          @click="dialogAccept=true,selectOrder(item)"
        >
          accept
        </v-btn>
           
          </td> 
        </tr>
      </template>
    </v-data-table>
    <!-- Custom Pagination -->
<v-row justify="center" class="my-4">
  <v-btn 
    icon 
    :disabled="pagination.currentPage === 1" 
    @click="changePage(pagination.currentPage - 1)"
  >
    <v-icon>mdi-chevron-left</v-icon>
  </v-btn>
  <v-btn 
    icon 
    :disabled="pagination.currentPage === pagination.lastPage" 
    @click="changePage(pagination.currentPage + 1)"
  >
    <v-icon>mdi-chevron-right</v-icon>
  </v-btn>
</v-row>

    <v-dialog 
    v-model="dialogAccept"
    max-width="600px"
    >
    <v-card>
      <v-card-title>accepting order</v-card-title>
      <v-card-text>
        <p>are you sure that you want to accept this order</p>
        <v-card-actions>
          <v-btn text @click="updateOrder(selectedOrder.id),dialogAccept=false">accept</v-btn>
        <v-btn text @click="dialogAccept=false">cancel</v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
    </v-dialog>
    <v-dialog 
    v-model="dialogDelete"
    max-width="600px"
    >
    <v-card>
      <v-card-title>deleting order </v-card-title>
      <v-card-text>
        <p>are you sure that you want to delete this order</p>
        <v-card-actions>
      <v-btn text @click="deleteOrder(selectedOrder.id),dialogDelete=false">delete</v-btn>
      <v-btn text @click="dialogDelete=false">cancel</v-btn>
    </v-card-actions>
      </v-card-text>
    </v-card>
    
    </v-dialog>
<v-dialog v-model="dialog" 
max-width="700px"
>
<v-card>
  <v-card-title>order products </v-card-title>
  
    <v-data-table
    v-if="selectedOrder && selectedOrder.products"
    :headers="orderHeaders"
    :items="selectedOrder.products"
    item-key="id"
    
    >
    <template v-slot:item="{item}" >
      <tr >
        <td>{{ item.name }}</td>
        <td>{{ item.quantity }}</td>
        <td>{{ item.price }}</td>
      </tr>

    </template>

    </v-data-table>
    
    <v-card-text>
      <v-card-actions>
        <v-btn text @click="dialog=false">close</v-btn>
      </v-card-actions>
  </v-card-text>
</v-card>
</v-dialog>

</v-container>

</template>

<script>

import TopBar from '@/components/TopBar.vue';
import { useOrderStore } from '@/stores/orderStore';

export default {
  components:{TopBar},
  data(){
    return{
      drawer : false,
      orderHeaders:[
      {title:'product name' , value:'name'},
      {title:'quantity', value:'quantity'},
      {title:'price',value:'price'}
      ],
      pagination: {
      currentPage: 1,
      lastPage: 2,
      total:6,
    },
      items: [
        { title: 'Products', icon: 'mdi-view-dashboard', link: '/product_page' },
        { title: 'Users', icon: 'mdi-account-multiple', link: '/clients_page' },
        { title: 'Orders', icon: 'mdi-chart-bar', link: '/orders_page' },
        { title: 'admin panel', icon: 'mdi-chart-bar', link: '/admin_panel' },
      ],
      headers : [
        {title : 'id', value : 'id'},
        {title : 'user name', value : 'user.name'},
        {title : 'email', value : 'user.email'},
        {title : 'status' , value : 'status'},
        {title:'price',value:'price'},

      ],
      dialogAccept:false,
      dialogDelete:false,
      
      
      menuVisible: false, // Controls visibility of the suggestions menu
      selectedOrder : {},
      dialog: false,
      isSearching: false,
    }
  },
  computed:{
    orderStore() {
      return useOrderStore();
    },
    filteredOrder(){
      if(!this.searchQuery)  return this.orderStore.orders || [];
      return this.orderStore.orders.filter(order => 
        order.name?.toLowerCase().includes(this.searchQuery.toLocaleLowerCase())
      );
    },

  },
  mounted(){
    this.orderStore.fetchOrders(this.orderStore.currentPage);
  },  
  methods:{
    searchOrder() {
      this.fetchOrders(this.currentPage)
    },
    
    selectOrder(order) {
      this.searchQuery = order.name;
      this.menuVisible = false;
      this.selectedOrder = order;
     
    },
    updateOrder(orderId){
      this.orderStore.updateOrder(orderId);
      this.orderStore.fetchOrders(this.pagination.currentPage);
    },
    deleteOrder(orderId){
      this.orderStore.deleteOrder(orderId);
      this.orderStore.fetchOrders(this.pagination.currentPage);
    },
    opendialog(order){
      this.selectOrder=order;
      this.dialog=true
    },
    closeDialog(){
      this.dialog=false
    },
    openAcceptDialog(order){
      this.selectOrder=order;
      this.dialogAccept=true
    },
    openDeleteDialog(order){
      this.selectOrder=order;
      this.dialogDelete=true
    },
    closeAcceptDialog(){
      this.dialogAccept=false;
    },
    closeDeleteDialog(){
      this.dialogDelete=false;
    },
    changePage(page) {
    if (page > 0 && page <= this.pagination.lastPage) {
      this.pagination.currentPage = page;
      this.fetchOrders(this.pagination.currentPage);
    }
  },
  fetchOrders(){
    this.orderStore.fetchOrders(this.pagination.currentPage);
  }

  }

}
</script>

<style scoped>
tr:hover{
  background: ghostwhite;
}
v-btn{
  margin-left: 25px;
}

</style>