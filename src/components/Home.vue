<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="4" offset-sm="4">
        <v-card max-width="30em" elevation="5">
          <v-card-actions>
            <v-form v-model="isFormValid">
              <v-row>
                <v-col cols="12">
                  <v-card-title class="justify-center"
                    >Iniciar Sesión</v-card-title
                  >
                </v-col>
                <v-col align="center" cols="12">
                  <v-avatar>
                    <img src="../assets/images/user-login.png" />
                  </v-avatar>
                </v-col>
                <v-col cols="12" md="8" offset-md="2">
                  <v-text-field
                    label="Ingrese su nombre de usuario"
                    :rules="rules"
                    hide-details="auto"
                    v-model="login.user"
                    autocomplete="off"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="8" offset-md="2">
                  <v-text-field
                    label="Ingrese su contraseña"
                    :rules="rules"
                    hide-details="auto"
                    type="password"
                    v-model="login.password"
                    autocomplete="off"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="8" offset-md="2">
                  <v-btn block :disabled="!isFormValid" v-on:click="onLogin()">
                    Iniciar Sesión
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ApiService from "../utils/apiService";
import { EventBus } from "../main";

export default {
  data() {
    return {
      login: {
        user: "",
        password: "",
      },
      rules: [(value) => !!value || "Requerido."],
      isFormValid: false
    };
  },
  methods: {
    onLogin() {
      EventBus.$emit("loadingShow");
      ApiService.post("/auth/login", {
        usuario: this.login.user,
        password: this.login.password,
      })
        .then((result) => {
          result.data.code === 200
            ? sessionStorage.setItem("token", result.data.data.token) +
              this.$router.push("/clients/table")
            : this.$toast.error(result.data.message, "Acceso denegado", {
                layout: 1,
              });
          EventBus.$emit("loadingClose");
        })
        .catch((err) => {
          EventBus.$emit("loadingClose");
          this.$toast.error(err.toString(), "Error", {
            layout: 1,
          });
        });
    },
  }
};
</script>

<style scoped>
.container {
  position: absolute;
  top: 15%;
  left: 0;
  right: 0;
}
</style>