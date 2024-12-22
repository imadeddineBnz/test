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
        
        <!-- Search Bar -->
        <v-row class="mt-6">
          <v-col>
            <v-text-field
              v-model="searchQuery"
              label="Search users"
              @input="onSearchInput"
              @keydown.enter="filterUsers"
              clearable
              :loading="isSearching"
            >
              <template v-slot:append>
                <v-icon v-if="searchQuery"
                
                >mdi-magnify</v-icon>
              </template>
            </v-text-field>

            <!-- Suggestions Dropdown -->
            <v-menu
              v-if="filteredUsers.length > 0 && searchQuery"
              v-model="menuVisible"
              :close-on-content-click="false"
              :max-height="'400'"
              offset-y
              transition="slide-y-reverse-transition"
            >
              <v-list>
                <v-list-item
                  v-for="user in filteredUsers"
                  :key="user.id"
                  @click="selectUser(user)"
                >
                  <v-list-item-content>
                    <v-list-item-title>{{ user.name }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>

        <!-- Data Table for Users -->
        <v-data-table
          :headers="headers"
          :items="userStore.users"
          :loading="isSearching"
          :page="currentPage"
          item-key="id"
          hide-default-footer
        >
          <template v-slot:item="{ item }">
            <tr @click="openUserModal(item)">
              <td>{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.email }}</td>
              <td>{{ item.status }}</td>
              <td>{{ item.role.name }}</td>
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
<!-- Per Page Selector --> 
 <v-row justify="center" class="my-4">
   <v-select class="select"
   v-model="pagination.perPage" 
   :items="[5, 10, 15, 20]" 
   label="Items per page" 
    >

   </v-select>
   </v-row>
        <!-- User Modal -->
        <v-dialog v-model="dialog" max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">{{ selectedUser ? 'User Status' : 'Add User' }}</span>
            </v-card-title>
            <v-card-text>
              <div v-if="!isBlocked">
                <v-text>This user is active</v-text>
              </div>
              <div v-else>
                <v-text>This user is blocked</v-text>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn text @click="closeModal">Cancel</v-btn>
              <div v-if="!isBlocked">
                <v-btn color="primary" @click="blockUser(selectedUser.id)">Block</v-btn>
              </div>
              <div v-else>
                <v-btn color="primary" @click="unblockUser(selectedUser.id)">Unblock</v-btn>
              </div>
              <v-btn text @click="deleteUser(selectedUser.id)">Delete</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import TopBar from '@/components/TopBar.vue';
import { useUserStore } from '@/stores/userStore';
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
      headers: [
        { title: 'ID', value: 'id' },
        { title: 'Name', value: 'name' },
        { title: 'Email', value: 'email' },
        { title: 'Status', value: 'status' },
        { title: 'Role', value: 'role' },
      ],
      searchQuery: '',
      menuVisible: false,
      selectedUser: null,
      dialog: false,
      isSearching: false,
      pagination: {
        currentPage: 1,
        lastPage: 3,
        perPage: 5,
        total: 11,
      },
      
    };
  },
  computed: {
    filteredUsers() {
    if (!this.searchQuery) {
      return this.userStore.users;
    }else{
     
       return this.userStore.users.filter(user =>
      user.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      
    );
    
    }
   
  },
    userStore() {
      return useUserStore();
    },
    
    isBlocked() {
      return this.selectedUser && this.selectedUser.status === 'blocked';
    },
  },
  mounted() {
    this.fetchUsers(this.pagination.currentPage, this.pagination.perPage);
    this.debouncedSearch = debounce(this.searchUsers, 500); 
  },
  methods: {
    async fetchUsers() {
    this.isSearching = true;
    await this.userStore.fetchUsers(this.pagination.currentPage, this.pagination.perPage,this.searchQuery);
    this.isSearching = false;
  },

    filterUsers() {
      this.menuVisible = false;
    },
    
    searchUsers() {
      this.fetchUsers(this.currentPage, this.itemsPerPage); // Keep current page, update search
     
    },

    openUserModal(user) {
      this.selectedUser = user;
      this.dialog = true;
    },

    closeModal() {
      this.dialog = false;
      this.selectedUser = null;
    },

    blockUser(userId) {
      this.userStore.blockUser(userId);
      this.closeModal();
    },

    unblockUser(userId) {
      const { name, email, roles } = this.selectedUser;
      this.userStore.unblockUser(userId, name, email, roles);
      this.closeModal();
    },

    deleteUser(userId) {
      this.userStore.deleteUser(userId);
      this.closeModal();
    },

    changePage(page) {
      this.pagination.currentPage = page;
      this.fetchUsers(this.pagination.currentPage, this.pagination.perPage);
    },

    changePerPage(perPage) {
      console.log(`Selected items per page: ${perPage}`);
      this.pagination.perPage = perPage;
      this.pagination.currentPage = 1; 
      this.fetchUsers(this.pagination.currentPage, this.pagination.perPage); 
      console.log(this.pagination); 
    },
    onSearchInput() {
      this.debouncedSearch(); // Use debounced function for search
    },

  },
  watch: {
    'pagination.perPage'(newValue, oldValue) {
      console.log(`Items per page changed from ${oldValue} to ${newValue}`);
      // Fetch users again with the updated perPage value
      this.fetchUsers(this.pagination.currentPage=1, newValue);
    },
  },
  
};
</script>


<style>
tr {
  cursor: pointer;
}
tr:hover {
  background: ghostwhite;
}
</style>



 