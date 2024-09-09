<template>
  <div class="container">
    <h2>Users:</h2>
    <router-link to="/adminpanel">Gå tilbage til admin panel</router-link><br><br>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Id</th>
          <th scope="col">E-mail</th>
          <th scope="col">Fornavn</th>
          <th scope="col">Efternavn</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" v-bind:key="user.id"> 
          <th scope="row">{{user.id}}</th>
          <td>{{user.email}}</td>
          <td>{{user.first_name}}</td>
          <td>{{user.last_name}}</td>
        </tr>
      </tbody>
    </table> 
  </div> 
</template>
<script>
import axios from 'axios';

  export default {
    name: 'Users',
    data() {
      return {
        users: null,
      };
    },
    created: function() {
      var token = localStorage.getItem("xauthtoken");
      axios
        .get('http://127.0.0.1:7071/api/authorization_users/', {
          headers: {
            'xauthtoken': token
          }
        })
        .then(res => {
            console.log(res.data)
            this.users = res.data;
        })
    }, 
  }
</script>
<style>
h3 {
  margin-bottom: 5%;
}
</style>
