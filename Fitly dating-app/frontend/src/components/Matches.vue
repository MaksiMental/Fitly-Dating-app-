<template>
  <div class="container">
    <h3>Dine nuværende matches</h3>
    <br>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Person1</th>
          <th scope="col">Person2</th>
          <th scope="col">Dato</th>
          <th scope="col">Fortrudt?</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="match in matches" v-bind:key="match.id">
          <td>{{match.person1}}</td>
          <td>{{match.person2}}</td>
          <td>{{match.date}}</td>
           <td><button class="btn btn-primary btn-block btn-lg" @click.prevent="removeMatch(match.match_id)">Fjern</button></td>
        </tr>
      </tbody>
    </table> 
      <router-link to="/profile">Gå tilbage til profil</router-link>
  </div>
</template>
<script>
import axios from 'axios';

  export default {
    name: 'Matches',
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
        .get('http://localhost:7071/api/users_matches', {
          headers: {
            'xauthtoken': token
          }
        }).then(response => {
            console.log(response.data)

          if (response.status == 400) {
            this.$router.push({ path : '/login' });
          }

          this.matches = response.data;
        })
        .catch((error) => {
          console.log(error);
          alert("You have no matches!")
          this.$router.push({ path : '/profile' });
        });
    },
    methods: {
      removeMatch(id) {
      console.log(id);
      var token = localStorage.getItem("xauthtoken");
      axios
        .delete(`http://localhost:7071/api/users_matches/?id=${id}`, {
          headers: {
            'xauthtoken': token
          },
        }).then((response) => {
          alert("Your match was deleted!")
          console.log(response)
          window.location.reload();
        })
        .catch((error) => {
          console.log(error);
        });
    }
    }
  }
</script>