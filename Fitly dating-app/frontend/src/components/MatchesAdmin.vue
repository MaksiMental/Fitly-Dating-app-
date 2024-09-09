<template>
  <div class="container">
    <h3>Databasens nuværende matches</h3>
    <br>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Person1</th>
          <th scope="col">Person2</th>
          <th scope="col">Dato</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="match in matches" v-bind:key="match.id">
          <td>{{match.match_id}}</td>
          <td>{{match.person1}}</td>
          <td>{{match.person2}}</td>
          <td>{{match.date}}</td>
        </tr>
      </tbody>
    </table> 
      <router-link to="/adminpanel">Gå tilbage til admin panelet</router-link>
  </div>
</template>
<script>
import axios from 'axios';

  export default {
    name: 'MatchesAdmin',
    data() {
      return {
        matches: null,
      };
    },
    created: function() {
      var token = localStorage.getItem("xauthtoken"); // Gets the JWT token from localStorage (Set when logged in or registered)
      if (!token) {
            this.$router.push({ path : '/login' });
      }
      axios
        .get('http://localhost:7071/api/authorization_matches', {
          headers: {
            'xauthtoken': token
          }
        }).then(response => {
          console.log(response.data)
          this.matches = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
</script>