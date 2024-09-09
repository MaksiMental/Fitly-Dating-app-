<template>
    <div>
        <h2>Login</h2>
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
        </div>
        <div class="form-group">
          <button class="btn btn-primary btn-block btn-lg">Login</button>
        </div>
        <div>Eller har du ikke en bruger? <router-link to="/">Register</router-link></div>
      </form>
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
        .post("http://localhost:7071/api/authentication/", {
          email: this.email,
          password: this.password,
        })
        .then((response) => {

          //redirect logic
          if (response.status == 200) {
            localStorage.setItem('xauthtoken', response.data.token)
            alert("Now login after u clicked OK!")
            this.$router.push({ path : '/profile' });
          }
          
        })
        .catch((error) => {
          alert("Fejl forkert e-mail eller password")
          console.log(error);
        });
    },
    onBlurEmail() {
      var x = document.getElementById("email").value;
      var atpos = x.indexOf("@");
      var dotpos = x.lastIndexOf(".");
      if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= x.length) {
          console.log("haha")
      }
    },
    onBlurPassword() {
        var x = document.getElementById("password").value;
        if(x == "") {
            console.log("haha")
        }
    }
  },
};
</script>
