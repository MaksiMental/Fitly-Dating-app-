<template>
  <div>
    <div class="container">
      <div id="errorbox" style="color: red"></div><br>
      <form @submit.prevent="onSubmit">
        <div class="form-group">
          <input
            type="email"
            @blur="onBlurEmail"
            id="email"
            v-model="email"
            placeholder="E-mail"
            class="form-control"
          />
          <div id="lblError_email"></div>
        </div>
        <div class="form-group">
          <input
            type="password"
            @blur="onBlurPassword"
            id="password"
            v-model="password"
            placeholder="Password"
            class="form-control"
          />
          <div id="lblError_password"></div>
        </div>
        <div class="form-group">
          <input
            type="text"
            v-model="firstName"
            placeholder="Fornavn"
            class="form-control"
          />
        </div>
        <div class="form-group">
          <input
            type="text"
            v-model="lastName"
            placeholder="Efternavn"
            class="form-control"
          />
        </div>
        <div class="form-group">
          <input
            type="number"
            v-model="age"
            placeholder="Alder"
            class="form-control"
          />
        </div>
        <div class="form-group">
          <input
            type="text"
            v-model="gender"
            placeholder="Køn"
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
          <button class="btn btn-primary btn-block btn-lg">Register</button>
        </div>
        <div>Har du allerede en bruger? <router-link to="/login">Login</router-link></div>
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
      firstName: "",
      lastName: "",
      age: "",
      gender: "",
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
            this.$router.push({ path : '/profile' });
          }
        })
        .catch((error) => {
          console.log(error);
        });
  },
  methods: {
    onSubmit() {
      axios
        .post("http://127.0.0.1:7071/api/users/", {
          email: this.email,
          password: this.password,
          first_name: this.firstName,
          last_name: this.lastName,
          age: this.age,
          gender: this.gender,
          favorite_activity: this.favoriteActivity,
          picture_url: this.picture,
          preferred_gender: this.preferredGender,
          preferred_age_start: this.ageStart,
          preferred_age_end: this.ageEnd,
        })
        .then((response) => {

          //redirect logic
          if (response.status == 200) {
            alert("Du er blevet oprettet i vores database, klik OK!")
            this.$router.push({ path : '/login' });
          }
          
        })
        .catch((error) => {
          document.getElementById("errorbox").innerHTML = "Tjek alle bokse, hvis der er ingen fejl, eksisterer emailen allerede.."
          console.log(error);
        });
    },
    onBlurEmail() {
      var x = document.getElementById("email").value;
      var atpos = x.indexOf("@");
      var dotpos = x.lastIndexOf(".");
      if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= x.length) {
          document.getElementById("lblError_email").innerHTML = "Indtast en gyldig e-mail";
					document.getElementById("email").classList.add("mystyle");
      }
      else {
        document.getElementById("lblError_email").innerHTML = "";
      }
    },
    onBlurPassword() {
    var x = document.getElementById("password").value;
    if(x == "") {
      document.getElementById("lblError_password").innerHTML = "Indtast en gyldig adgangskode";
      document.getElementById("password").classList.add("mystyle");
    }
    else {
      document.getElementById("lblError_password").innerHTML = "";
      document.getElementById("password").classList.remove("mystyle");
    }

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