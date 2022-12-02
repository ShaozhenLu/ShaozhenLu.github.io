

<template>
  
  <div>
    <header class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
      
      <div>.</div>
      <div>
        <img src="../public/icons8-stocks.svg" alt="">
      <a class="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6" href="#">Stock Market Summary Dashboard</a>
      </div>
      
      <button class="navbar-toggler position-absolute d-md-none collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <!-- <input class="form-control form-control-dark w-100 rounded-0 border-0" type="text" placeholder="Search" aria-label="Search"> -->
      <div class="navbar-nav">
        <div class="nav-item text-nowrap">
          <a class="nav-link px-3" href="#">.</a>
        </div>
      </div>
    </header>

    <div class="container-fluid">

      <div class="row">
        <nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
          <div class="position-sticky pt-3 sidebar-sticky">
            <ul class="nav flex-column">
              <li class="nav-item">
                <RouterLink :class="'nav-link ' + (rootPath === '' ? 'active' : '')" to="/" @click="rootPath=''">
                  <i class="bi bi-graph-up align-baseline"></i> 
                  Market Index
                </RouterLink>
                <RouterLink :class="'nav-link ' + (rootPath === '' ? 'active' : '')" to="/sectoroverview" @click="rootPath=''">
                  <i class="bi bi-bar-chart-line align-baseline"></i> 
                  Sector Overview
                </RouterLink>
                <RouterLink :class="'nav-link ' + (rootPath === '' ? 'active' : '')" to="/globalmarket" @click="rootPath=''">
                  <i class="bi bi-globe align-baseline"></i> 
                  Global Market
                </RouterLink>
                <RouterLink :class="'nav-link ' + (rootPath === '' ? 'active' : '')" to="/predict" @click="rootPath=''">
                  <i class="bi bi-lightning-charge align-baseline"></i> 
                  Prediction
                </RouterLink>
                <RouterLink :class="'nav-link ' + (rootPath === '' ? 'active' : '')" to="/about" @click="rootPath=''">
                  <i class="bi bi-info-circle align-baseline"></i> 
                  About
                </RouterLink>
                <!-- <a class="nav-link active" aria-current="page" href="#">
                  <span data-feather="home" class="align-text-bottom"></span>
                  Dashboard
                </a> -->
              </li>


              <!-- <li class="nav-item">
                <RouterLink :class="'nav-link ' + (rootPath === 'indexView' ? 'active' : '')" to="/indexView" @click="rootPath='indexView'">
                  <i className="bi bi-headset align-baseline"></i>
                  INDEX Chart2
                </RouterLink> -->
                <!-- <a class="nav-link" href="#">
                  <span data-feather="file" class="align-text-bottom"></span>
                  Orders
                </a> -->
              <!-- </li> -->
              
            </ul>
            
          </div>
        </nav>

      </div>
    </div>  
    <div class="container-fluid">
      <RouterView />
    </div>
  </div>





</template>





<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
// import HelloWorld from './components/HelloWorld.vue'

import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
// const router = useRouter();

const rootPath = ref('');

onMounted(() => {
  // path.value = route.path;
  console.log(route.path);
  rootPath.value = route.path.split('/')[1];
});
</script>


<style scoped>

body {
  font-size: .875rem;
}

.feather {
  width: 16px;
  height: 16px;
}

/*
 * Sidebar
 */

.sidebar {
  position: fixed;
  top: 0;
  /* rtl:raw:
  right: 0;
  */
  bottom: 0;
  /* rtl:remove */
  left: 0;
  z-index: 100; /* Behind the navbar */
  padding: 48px 0 0; /* Height of navbar */
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, .1);
}

@media (max-width: 767.98px) {
  .sidebar {
    top: 5rem;
  }
}

.sidebar-sticky {
  height: calc(100vh - 48px);
  overflow-x: hidden;
  overflow-y: auto; /* Scrollable contents if viewport is shorter than content. */
}

.sidebar .nav-link {
  font-weight: 500;
  color: #333;
}

.sidebar .nav-link .feather {
  margin-right: 4px;
  color: #727272;
}

.sidebar .nav-link.active {
  color: #2470dc;
}

.sidebar .nav-link:hover .feather,
.sidebar .nav-link.active .feather {
  color: inherit;
}

.sidebar-heading {
  font-size: .75rem;
}

/*
 * Navbar
 */

.navbar-brand {
  padding-top: .75rem;
  padding-bottom: .75rem;
  background-color: rgba(0, 0, 0, .25);
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, .25);
}

.navbar .navbar-toggler {
  top: .25rem;
  right: 1rem;
}

.navbar .form-control {
  padding: .75rem 1rem;
}

.form-control-dark {
  color: #fff;
  background-color: rgba(255, 255, 255, .1);
  border-color: rgba(255, 255, 255, .1);
}

.form-control-dark:focus {
  border-color: transparent;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, .25);
}

.bd-placeholder-img {
  font-size: 1.125rem;
  text-anchor: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}

@media (min-width: 768px) {
  .bd-placeholder-img-lg {
    font-size: 3.5rem;
  }
}

.b-example-divider {
  height: 3rem;
  background-color: rgba(0, 0, 0, .1);
  border: solid rgba(0, 0, 0, .15);
  border-width: 1px 0;
  box-shadow: inset 0 .5em 1.5em rgba(0, 0, 0, .1), inset 0 .125em .5em rgba(0, 0, 0, .15);
}

.b-example-vr {
  flex-shrink: 0;
  width: 1.5rem;
  height: 100vh;
}

.bi {
  vertical-align: -.125em;
  fill: currentColor;
}

.nav-scroller {
  position: relative;
  z-index: 2;
  height: 2.75rem;
  overflow-y: hidden;
}

.nav-scroller .nav {
  display: flex;
  flex-wrap: nowrap;
  padding-bottom: 1rem;
  margin-top: -1px;
  overflow-x: auto;
  text-align: center;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
}

/* header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
} */
</style>
