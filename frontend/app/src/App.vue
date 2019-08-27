<template>
  <div class="page-container">
    <md-app style="min-height: 100vh; max-height: 100vh" md-waterfall md-mode="fixed">
      <md-app-toolbar class="md-primary">
        <md-button class="md-icon-button" @click="toggleMenu" v-if="!menuVisible">
          <md-icon>menu</md-icon>
        </md-button>
        <span class="md-title">{{ $route.meta.title }}</span>
      </md-app-toolbar>
      <md-app-drawer :md-active.sync="menuVisible" md-persistent="mini">
        <md-toolbar class="md-transparent" md-elevation="0">
          <span>Navigation</span>
            <div class="md-toolbar-section-end">
            <md-button class="md-icon-button md-dense" @click="toggleMenu">
              <md-icon>keyboard_arrow_left</md-icon>
            </md-button>
          </div>
        </md-toolbar>

        <md-list>
          <md-list-item :to="{ name: 'home'}" exact>
            <md-icon>home</md-icon>
            <span class="md-list-item-text">Home</span>
          </md-list-item>

          <md-list-item v-if="!isLoggedIn" :to="{ name: 'login'}" >
            <md-icon>account_circle</md-icon>
            <span class="md-list-item-text">Login</span>
          </md-list-item>

          <md-list-item v-if="isLoggedIn" :to="{ name: 'logout'}" >
            <md-icon>account_circle</md-icon>
            <span class="md-list-item-text">Logout</span>
          </md-list-item>

          <md-list-item v-if="isLoggedIn" :to="{ name: 'tasks'}">
            <md-icon>assignment</md-icon>
            <span class="md-list-item-text">Tasks</span>
          </md-list-item>

          <md-list-item v-if="isLoggedIn" :to="{ name: 'pipelines'}">
            <md-icon>schedule</md-icon>
            <span class="md-list-item-text">Pipelines</span>
          </md-list-item>

        </md-list>
      </md-app-drawer>
      <md-app-content>
        <router-view />
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
  import router from './router'
  import auth from './auth'

  export default {
    // name: 'PersistentMini',
    data: () => ({
      menuVisible: true,
      isLoggedIn: auth.loggedIn(),
    }),
    created: function () {
      auth.onChange = loggedIn => {
        this.isLoggedIn = loggedIn
      }
    },
    methods: {
      toggleMenu () {
        this.menuVisible = !this.menuVisible
      }
    }
  }

</script>
