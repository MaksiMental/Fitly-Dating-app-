<template>
    <div>
        <h2 style="padding-top: 30px;">Velkommen! Admin</h2>
        <br>
        <br>
        <div class="seperator"></div>
        <br>
        <div class="form-group">
          <h3>Indstillinger</h3>
          <div class="col-md-6" style="display: inline-block">
          <div style="margin-bottom: 10px;">Opdater en vilkårlig brugers profil <router-link to="/updateadmin">Opdatér</router-link></div>
          <div class="seperator"></div>
          <br>
          <div class="form-group">
          <input
            type="number"
            id="id"
            v-model="id"
            placeholder="ID"
            class="form-control"
          />
          </div>
          <button @click="deleteUser(id)" style="float: right;" class="btn btn-secondary btn-block btn-lg">Slet en vilkårlig brugers profil</button>
          </div>
        </div>
        <div class="seperator"></div>
        <br>
        <div class="form-group">
          <h3>Matches</h3>
          <div class="col-md-6" style="display: inline-block">
            <div style="margin-bottom: 10px;">Se alle databasens matches:<router-link to="/matchesadmin"> matches</router-link></div>
          </div>
        </div>
        <div class="form-group">
          <h3>Brugere</h3>
          <div class="col-md-6" style="display: inline-block">
            <div style="margin-bottom: 10px;">Se alle databasens brugerer:<router-link to="/usersadmin"> brugerer</router-link></div>
          </div>
        </div>
        <div class="seperator"></div>
        <br>
        <p style="font-weight: bold;">Log ud af admin paneleet</p>
        <button @click="logout" style="width: 150px; margin-left: auto; margin-right: auto;" class="btn btn-primary btn-block btn-lg">Log ud her</button>
    </div>
</template>

<script>
import axios from "axios";
export default {
  name: 'AdminPanel', 
  data() {
    return {
      id: "",
    };
  },
  beforeCreate: function() {
      var token = localStorage.getItem("xauthtoken"); // Gets the JWT token from localStorage (Set when logged in or registered)
      axios
        .post('http://localhost:7071/api/authorization', null, {
          headers: {
            'xauthtoken': token
          }
        }).then(response => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
          this.$router.push({ path : '/login' });
        });
  },
  methods: {
    logout() {
        localStorage.removeItem('xauthtoken');
        this.$router.push({ path : '/login' });
    },
    deleteUser(id) {
      var token = localStorage.getItem("xauthtoken");
      axios
        .delete(`http://localhost:7071/api/authorization_users/?id=${id}`, {
          headers: {
            'xauthtoken': token
          }
        }).then(response => {
          console.log(response);
          alert("Brugeren er blevet slettet");
        })
        .catch((error) => {
          alert("Noget gik galt, brugeren findes muligvis ikke")
          console.log(error);
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