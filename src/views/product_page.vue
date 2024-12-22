<template>
  <v-container>
    <!-- Top Bar -->
    <TopBar @toggleDrawer="drawer = !drawer" />

    <!-- Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" app clipped>
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

    <!-- Search Bar -->
    <v-row class="mt-6">
      <v-col>
        <v-text-field
          v-model="searchQuery"
          label="Search product"
          @input="onSearchInput"
          @keydown.enter="filterProduct"
          clearable
          :loading="isSearching"
        >
          <template v-slot:append>
            <v-icon v-if="searchQuery">mdi-magnify</v-icon>
          </template>
        </v-text-field>

        <!-- Suggestions Dropdown -->
        <v-menu
          v-if="filteredProducts.length > 0 && searchQuery"
          v-model="menuVisible"
          :close-on-content-click="false"
          :max-height="'400'"
          offset-y
          transition="slide-y-reverse-transition"
        >
          <v-list>
            <v-list-item
              v-for="product in filteredProducts"
              :key="product.id"
              @click="selectProduct(product)"
            >
              <v-list-item-content>
                <v-list-item-title>{{ product.name }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>

    <!-- Data Table for Products -->
    <v-data-table
      :headers="headers"
      :items="productStore.products"
      :loading="isSearching"
      no-data-text="No product available"
      item-key="id"
      hide-default-footer
    >
      <template v-slot:body="{ items }">
        <tr v-for="item in items" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.category_id }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.description }}</td>
          <td>{{ item.quantity }}</td>
          <td>{{ item.price }}</td>
          <td>{{ item.in_stock ? 'In stock' : 'Out of stock' }}</td>
          <td>{{ item.in_order ? 'In order' : '0 in order' }}</td>
          <td  >
            <v-btn v-if="!item.in_order" @click="deleteProduct(item.id)"  color="red" small>Delete</v-btn>
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

    <!-- Create Product Button -->
    <v-row class="mt-4">
      <v-col>
        <v-btn @click="openDialog()" color="success">Create Product</v-btn>
      </v-col>
    </v-row>

    <!-- Dialog for Create Product -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          Create Product
        </v-card-title>
        <v-card-text>
          <v-select
            v-model="newProduct.category_id"
            :items="categories"
            label="Category"
            item-value="id"
            item-text="name"
            return-object
            :rules="[value => !!value || 'Category is required']"
          ></v-select>

          <v-text-field v-model="newProduct.name" label="Name"></v-text-field>
          <v-text-field v-model="newProduct.description" label="Description"></v-text-field>
          <v-text-field v-model="newProduct.quantity" label="Quantity" type="number"></v-text-field>
          <v-text-field v-model="newProduct.price" label="Price" type="number"></v-text-field>
          <v-file-input
            v-model="newProduct.image"
            label="Product Image"
            accept="image/*"
            multiple
            prepend-icon="mdi-camera"
          ></v-file-input>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="saveProduct(this.newProduct)">Save</v-btn>
          <v-btn color="red" @click="closeModal">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>




<script>
import TopBar from '@/components/TopBar.vue';
import { useProductStore } from '@/stores/productStore';
import { debounce } from 'lodash';


export default {
  components: { TopBar },
  
  data() {
    return {
     
      drawer: false,
      items: [
        { title: 'Products', icon: 'mdi-view-dashboard', link: '/product_page' },
        { title: 'Users', icon: 'mdi-account-multiple', link: '/clients_page' },
        { title: 'Orders', icon: 'mdi-chart-bar', link: '/orders_page' },
        { title: 'admin panel', icon: 'mdi-chart-bar', link: '/admin_panel' },
      ],
      newProduct: {
        category_id: null,
        name: '',
        description: '',
        quantity: '',
        price: '',
        image: [],
      },
      categories: [
      { id: 1, title: 'Electronics' },
      { id: 2, title: 'Furniture' },
      ],
      headers: [
        { title: 'id', value: 'id' },
        { title: 'category_id', value: 'category_id' },
        { title: 'name', value: 'name' },
        { title: 'description', value: 'description' },
        { title: 'quantity', value: 'quantity' },
        { title: 'price', value: 'price' },
        { title: 'stock_state', value: 'stock_state' },
        { title: 'order_state', value: 'order_state' },
      ],
      pagination: {
      currentPage: 1,
      lastPage: 2,
      total:6,
    },
      searchQuery: '',
      menuVisible: false,
      dialog: false,
      isSearching: false,
    };
  },
  computed: {
    productStore() {
      return useProductStore();
    },
    filteredProducts() {
      if (!this.searchQuery) return this.productStore.products;

      return this.productStore.products.filter(product =>
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  mounted() {
    this.productStore.fetchProducts(this.productStore.currentPage);
    this.debouncedSearch = debounce(this.searchProduct, 500);
  },
  methods: {
    searchProduct() {
      this.fetchProducts(this.currentPage); // Keep current page, update search
     
    },
    
   
    openDialog() {
      this.newProduct = { category_id: '', name: '', description: '', quantity: 0, price: 0, image: [] };
      this.dialog = true;
    },
    closeModal() {
      this.dialog = false;
      this.newProduct = {
        category_id: null,
        name: '',
        description: '',
        quantity: '',
        price: '',
        image: [],
      };
    },
    saveProduct(newProduct) {
      console.log(this.newProduct.image)
      newProduct.category_id = newProduct.category_id.id;
      console.log(this.newProduct.category_id)
      this.createProduct(newProduct);
      this.closeModal();
    },
    createProduct(newProduct) {
      this.productStore.createProduct(newProduct);
      this.fetchProducts(this.pagination.currentPage)
    },
    deleteProduct(productId) {
      this.productStore.deleteProduct(productId);
    },
    fetchProducts() {

      this.productStore.fetchProducts(this.pagination.currentPage,this.searchQuery);
    },
      changePage(page) {
      if (page > 0 && page <= this.pagination.lastPage) {
        this.pagination.currentPage = page;
        this.fetchProducts(this.pagination.currentPage);
      }
    },
    // Trigger search only after user stops typing (debounced)
    onSearchInput() {
      this.debouncedSearch(); // Use debounced function for search
    },

  
  },
};
</script>

<style scoped>
tr {
  cursor: pointer;
}
tr:hover {
  background: ghostwhite;
}
.v-row.mt-6 {
  margin-top: 60px;
}
</style>
