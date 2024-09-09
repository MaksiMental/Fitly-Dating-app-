<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  padding: 30px;
  border-radius: 4px;
  border: 2px solid #e7e7e7;
  background: #ffffffb0;
}

img.fitly-logo {
    position: relative;
    width: 13%;
    left: 50%;
    top: 130px;
    transform: translate(-50%, -50%);
    border-radius:12px;
}

.form-control {
    height: calc(2em + .75rem + 2px);
}

.btn-primary, .btn-primary:hover, .btn-primary:active, .btn-primary:visited {
    background-color: #77b366 !important;
    border: none
}

a {
  color: #77b366;
}
</style>