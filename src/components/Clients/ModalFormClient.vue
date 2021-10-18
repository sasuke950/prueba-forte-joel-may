<template>
  <v-row justify="center">
    <v-dialog v-model="show" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ title }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form v-model="isFormValid">
              <v-row>
                <v-col cols="12" sm="6" md="12">
                  <v-text-field
                    v-model="name"
                    label="Nombre Completo"
                    :rules="[(value) => !!value || 'Ingrese un nombre']"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="12">
                  <v-text-field
                    v-model="email"
                    label="Correo electrónico"
                    :rules="[
                      (value) => !!value || 'Ingrese un correo electrónico',
                      (v) =>
                        /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                          v
                        ) || 'Ingrese un correo electrónico válido',
                    ]"
                    hint="ejemplo: alguien@empresa.com"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="12">
                  <v-text-field
                    v-model="phoneNumber"
                    type="phone"
                    label="Número teléfonico"
                    hint="ejemplo:(477) 999 99 99"
                    min-data="10"
                    :rules="[
                      (value) =>
                        !!value || 'Ingrese un número de teléfono válido',
                      (value) =>
                        (value || '').length >= 14 ||
                        'Ingrese los 10 dígitos del número',
                    ]"
                    @keyup="acceptNumber()"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="12">
                  <v-text-field
                    v-model="rfc"
                    label="RFC"
                    min-data="13"
                    :rules="[
                      (value) => !!value || 'Ingrese un RFC',
                      (value) =>
                        (value || '').length >= 12 ||
                        'Ingrese los 12 ó 13 caracteres del RFC',
                      (value) =>
                        (value || '').length <= 13 ||
                        'Ingrese los 12 ó 13 caracteres del RFC',
                    ]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <div>
                    <v-menu
                      ref="menu"
                      v-model="menu"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="birthDate"
                          label="Fecha de nacimiento"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="birthDate"
                        :active-picker.sync="activePicker"
                        :max="
                          new Date(
                            Date.now() - new Date().getTimezoneOffset() * 60000
                          )
                            .toISOString()
                            .substr(0, 10)
                        "
                        min="1950-01-01"
                        @change="save"
                      ></v-date-picker>
                    </v-menu>
                  </div>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                    :items="itemStatus"
                    label="Estatus"
                    required
                    v-model="status"
                    :rules="[(value) => !!value || 'Seleccione un estatus']"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="12">
                  <v-text-field
                    v-model="address"
                    label="Domicilio"
                    :rules="[(value) => !!value || 'Ingrese un domicilio']"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="12">
                  <v-text-field
                    v-model="creditLimit"
                    label="Límite crédito"
                    :rules="[
                      (value) => !!value || 'Seleccione un límite de crédito',
                      (value) =>
                        (!isNaN(parseFloat(value)) && value >= 0) ||
                        'Sólo se permiten valores númericos',
                    ]"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="show = false">
            Cerrar
          </v-btn>
          <v-btn
            color="blue darken-1"
            :disabled="!isFormValid"
            text
            @click="
              show = false;
              saveClient();
            "
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import { EventBus } from "../../main";

export default {
  name: "modal-client",
  props: {
    title: String,
    action: String,
    dataClient: Object,
    value: Boolean,
  },
  data() {
    return {
      clientId: 0,
      name: "",
      rfc: "",
      birthDate: "",
      email: "",
      phoneNumber: "",
      address: "",
      creditLimit: "",
      status: "",
      itemStatus: ["INACTIVO", "ACTIVO", "BAJA", "BLOQUEADO", "ELIMINADO"],
      activePicker: null,
      menu: false,
      isFormValid: false
    };
  },
  mounted() {
    this.action == "EDIT" ? this.setDataClients() : (this.clientId = 0);
  },
  methods: {
    setDataClients() {
      let date = this.dataClient.fechaNacimiento.split("T");
      this.clientId = this.dataClient.clientId;
      this.name = this.dataClient.nombreCompleto;
      this.rfc = this.dataClient.rfc;
      this.birthDate = date[0];
      this.email = this.dataClient.correoElectronico;
      this.phoneNumber = this.dataClient.telefonoMovil;
      this.address = this.dataClient.domicilio;
      this.creditLimit = this.dataClient.limiteCredito;
      this.status = this.itemStatus[this.dataClient.estatusClienteId];
    },
    saveClient() {
      const statusClient = (status) => status == this.status;
      EventBus.$emit("saveClient", {
        clienteId: this.dataClient.clienteId,
        nombreCompleto: this.name,
        rfc: this.rfc,
        fechaNacimiento: this.birthDate,
        correoElectronico: this.email,
        telefonoMovil: this.phoneNumber,
        domicilio: this.address,
        limiteCredito: parseFloat(this.creditLimit),
        estatusClienteId: this.itemStatus.findIndex(statusClient),
      });
    },
    acceptNumber() {
      let x = this.phoneNumber
        .replace(/\D/g, "")
        .match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
      this.phoneNumber = !x[2]
        ? x[1]
        : "(" + x[1] + ") " + x[2] + (x[3] ? "-" + x[3] : "");
    },
    save(date) {
      this.$refs.menu.save(date);
    },
  },
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
  watch: {
    menu(val) {
      val && setTimeout(() => (this.activePicker = "YEAR"));
    },
  },
};
</script>