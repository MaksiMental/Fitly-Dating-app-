<template>
  <div>
    <div class="container">
      <br>
      <form @submit.prevent="onSubmit">
        <div class="form-group">
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="E-mail"
            class="form-control"
          />
        </div>
        <div class="form-group">
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Password"
            class="form-control"
          />
        </div>
        <div class="form-group">
          <input
            type="text"
            v-model="favoriteActivity"
            placeholder="Interesse"
            class="form-control"
          />
        </div>
        <div class="form-group">
          <input
            type="text"
            v-model="picture"
            placeholder="Billede URL (valgfri)"
            class="form-control"
          />
        </div>
        <div class="form-group">
          <input
            type="text"
            v-model="preferredGender"
            placeholder="Hvilket køn søger du? (Vælg kun 1, mand eller kvinde)"
            class="form-control"
          />
        </div>
         <div class="form-group">
          <input
            type="number"
            v-model="ageStart"
            placeholder="Alder præference start"
            class="form-control"
          />
        </div>
         <div class="form-group">
          <input
            type="number"
            v-model="ageEnd"
            placeholder="Alder præference slut"
            class="form-control"
          />
        </div>
        <div class="form-group">
          <button class="btn btn-primary btn-block btn-lg">Ændre indstillinger</button>
        </div>
        <div>Tilbage til din profil? <router-link to="/profile">Profil</router-link></div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: 'Register',
  data() {
    return {
      email: "",
      password: "",
      favoriteActivity: "",
      picture: "",
      preferredGender: "",
      ageStart: "",
      ageEnd: ""
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
  methods: {
    onSubmit() {
      var token = localStorage.getItem("xauthtoken"); // Gets the JWT token from localStorage (Set when logged in or registered)
      axios
        .put("http://127.0.0.1:7071/api/users/", {
          email: this.email,
          password: this.password,
          favorite_activity: this.favoriteActivity,
          picture_url: this.picture,
          preferred_gender: this.preferredGender,
          preferred_age_start: this.ageStart,
          preferred_age_end: this.ageEnd,
        }, {
          headers: {
            'xauthtoken': token
          }
        })
        .then((response) => {

          //redirect logic
          if (response.status == 200) {
            alert("Din bruger er blevet opdateret, klik OK og bliv sendt til profil!")
            this.$router.push({ path : '/profile' });
          }
          
        })
        .catch((error) => {
          alert("Tjek alle bokse igen, du har måske skrevet en forkert værdi");
          console.log(error);
        });
    }
  },
};
</script>

<style scoped>
.container {
    max-width: 500px;
}

#lblError_email, #lblError_password {
 margin-top: 15px;
 color: red;
 text-align:left;
}
</style>