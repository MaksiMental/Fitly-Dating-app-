<template>
  <div class="container" v-if="match">
    <br>
    <h3>Foreslået match</h3>
    <img src="https://i.pravatar.cc/300" style="border-radius: 50%; margin-top: 20px; margin-bottom: 60px;" alt="Girl in a jacket" width="500" height="500">
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Navn</th>
          <th scope="col">Alder</th>
          <th scope="col">Køn</th>
          <th scope="col">Interesse</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{match.first_name}}</td>
          <td>{{match.age}}</td>
          <td>{{match.gender}}</td>
          <td>{{match.favorite_activity}}</td>
        </tr>
      </tbody>
    </table>
    <br>
    <div class="buttons">
        <button class="btn btn-primary btn-block btn-lg" @click.prevent="like">Like {{match.first_name}}</button>
        <button class="btn btn-secondary btn-block btn-lg" @click.prevent="dislike">Dislike {{match.first_name}}</button>
    </div>
    <br>
    <br>
    <h4>Eller gå tilbage</h4>
        <router-link to="/profile">Tilbage til din profil</router-link> 
  </div>
</template>
<script>
import axios from 'axios';

  export default {
    name: 'Recommended',
    data() {
      return {
        match: null,
      };
    },
    created: function() {
      var token = localStorage.getItem("xauthtoken"); // Gets the JWT token from localStorage (Set when logged in or registered)
      if (!token) {
            this.$router.push({ path : '/login' });
      }
      axios
        .get('http://127.0.0.1:7071/api/users_recommendations', {
          headers: {
            'xauthtoken': token
          }
        }).then(response => {
          console.log(response);
          if(response.data.status == 204) {
              alert("Ingen kan lide dig, desværre");
              this.$router.push({ path : '/profile' });
          }
          this.match = response.data[0];
        })
        .catch((error) => {
          console.log(error);
        });
    }, 
    methods: {
    like() {
      var token = localStorage.getItem("xauthtoken");
      const body = {};
      axios
        .post(`http://127.0.0.1:7071/api/users_likes/?id=${this.match.id}`, body, {
          headers: {
            'xauthtoken': token
          },
        }).then((response) => {
          if(response.data.matchInserted) {
            alert("You have matched")
            this.$router.push({ path : '/matches' });
          } else {
            alert("Dit like blev registreret!")
            window.location.reload();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    dislike() {
      var token = localStorage.getItem("xauthtoken");
      const body = {};
      axios
        .post(`http://127.0.0.1:7071/api/users_dislikes/?id=${this.match.id}`, body, {
          headers: {
            'xauthtoken': token
          },
        }).then((response) => {
          alert("Dit dislike blev registreret!")
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
<style>
h3 {
  margin-bottom: 5%;
}
</style>
