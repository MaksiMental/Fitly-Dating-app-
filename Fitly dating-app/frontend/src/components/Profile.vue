<template>
    <div>
        <h2 style="padding-top: 30px;">Velkommen!</h2>
        <br>
        <br>
        <div class="seperator"></div>
        <br>
        <div class="form-group">
          <h3>Indstillinger</h3>
          <div class="col-md-6" style="display: inline-block">
          <div style="margin-bottom: 10px;">Vil du ændre dine indstillinger? <router-link to="/update">Opdatér profil</router-link></div>
          <button @click="deleteProfile" style="float: right;" class="btn btn-secondary btn-block btn-lg">Slet Profil</button>
          </div>
        </div>
        <div class="seperator"></div>
        <br>
        <div class="form-group">
          <h3>Matches</h3>
          <p>Her kan du se dine matches eller slette dine matches</p>
          <div class="col-md-6" style="display: inline-block">
            <div style="margin-bottom: 10px;">Har du fortrudt dit match? <router-link to="/matches">Se/slet matches</router-link></div>
            <div style="margin-bottom: 10px;">Søger du en dejlig person? <router-link to="/recommended">Find match</router-link></div>
          </div>
        </div>
        <div class="seperator"></div>
        <br>
        <p style="font-weight: bold;">Log ud min gode ven</p>
        <button @click="logout" style="width: 150px; margin-left: auto; margin-right: auto;" class="btn btn-primary btn-block btn-lg">Log ud her</button>
    </div>
</template>

<script>
import axios from "axios";
export default {
  name: 'Register', 
  data() {
    return {
      email: "",
      password: ""
    };
  },
  beforeCreate: function() {
      var token = localStorage.getItem("xauthtoken"); // Gets the JWT token from localStorage (Set when logged in or registered)
      axios
        .post('http://localhost:7071/api/authentication', null, {
          headers: {
            'xauthtoken': token
          }
        }).then(response => {

          if (response.status == 200) {
            console.log("Du er logget ind")
          }
        })
        .catch((error) => {
          console.log(error);
          this.$router.push({ path : '/login' });
        });
  },
  created: function() {
  var token = localStorage.getItem("xauthtoken"); // Gets the JWT token from localStorage (Set when logged in or registered)
  axios
    .post('http://localhost:7071/api/authorization', null, {
      headers: {
        'xauthtoken': token
      }
    }).then(response => {

      if (response.status == 200) {
        this.$router.push({ path : '/adminpanel' });
      }

    })
    .catch((error) => {
      console.log(error);
    });
  },
  methods: {
    logout() {
        localStorage.removeItem('xauthtoken');
        this.$router.push({ path : '/login' });
    },
    deleteProfile() {
      var token = localStorage.getItem("xauthtoken"); // Gets the JWT token from localStorage (Set when logged in or registered)
      axios
        .delete('http://localhost:7071/api/users', {
          headers: {
            'xauthtoken': token
          }
        }).then(response => {

          if (response.status == 200) {
            alert("Din bruger er blevet slettet")
            localStorage.removeItem('xauthtoken');
            this.$router.push({ path : '/' })
          }
        })
        .catch((error) => {
          console.log(error);
          alert("Der skete en fejl, prøv igen senere!")
        });
    }
    
  }
};
</script>

<style scoped>
.seperator {
  border-top: 1px solid #e7e7e7;
}
</style>