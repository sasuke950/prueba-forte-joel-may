<template>
  <v-card elevation="0">
    <v-card-subtitle>
      <v-breadcrumbs :items="items" divider="/"></v-breadcrumbs>
    </v-card-subtitle>
    <v-container class="green lighten-5">
      <v-card-title> Listado de Clientes </v-card-title>
      <v-row>
        <v-col cols="12" xs="12" offset-xs="0" sm="1" offset-sm="11">
          <v-btn
            title="Nuevo cliente"
            color="green"
            dark
            small
            @click="
              (configModal.openDialog = true),
                (configModal.title = 'Nuevo cliente'),
                (configModal.dataClient = {}),
                (configModal.action = 'NEW')
            "
          >
            <v-icon dark>fas fa-user-plus</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" xs="12">
          <v-data-table
            :headers="infoTable.headers"
            :items="infoTable.clients"
            :items-per-page="5"
            :footer-props="{
              'items-per-page-options': [5, 10, 15, 20, -1],
              'items-per-page-all-text': 'Todos',
              'items-per-page-text': 'Filas por página:',
            }"
            class="elevation-1"
            ><template v-slot:body="{ items }">
              <tbody>
                <tr v-for="item in items" :key="item.clienteId">
                  <td>{{ item.nombreCompleto }}</td>
                  <td>{{ item.correoElectronico }}</td>
                  <td>NA</td>
                  <td>{{ item.estatusCliente }}</td>
                  <td>{{ item.limiteCredito }}</td>
                  <td>
                    <v-btn
                      color="primary"
                      dark
                      x-small
                      :title="'Editar cliente: ' + item.nombreCompleto"
                      @click="getDataClient(item.clienteId)"
                    >
                      <v-icon x-small dark>fas fa-user-edit</v-icon>
                    </v-btn>
                    <v-btn
                      color="red"
                      dark
                      x-small
                      :title="'Eliminar cliente: ' + item.nombreCompleto"
                      @click="
                        questionDelete(item.clienteId, item.nombreCompleto)
                      "
                    >
                      <v-icon x-small dark>fas fa-user-times</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
            <template v-slot:[`footer.page-text`]="{ pageStart, pageStop }">
              {{ pageStart }} de {{ pageStop }}
            </template>
          </v-data-table>
        </v-col>
      </v-row>
      <modal-client
        v-if="configModal.openDialog"
        v-model="configModal.openDialog"
        :title="configModal.title"
        :action="configModal.action"
        :dataClient="configModal.dataClient"
      ></modal-client>
    </v-container>
  </v-card>
</template>

<script>
import ApiService from "../../utils/apiService.js";
import { AuthService } from "../../utils/authService.js";
import modalClient from "./ModalFormClient.vue";
import { EventBus } from "../../main";

export default {
  components: {
    modalClient,
  },
  data() {
    return {
      items: [
        {
          text: "Inicio",
          disabled: false,
          href: "/",
        },
        {
          text: "Clientes",
          disabled: false,
          href: "",
        },
        {
          text: "Listado",
          disabled: false,
          href: "",
        },
      ],
      infoTable: {
        headers: [
          {
            text: "Nombre",
            align: "start",
            sortable: true,
            value: "nombreCompleto",
          },
          {
            text: "Correo electrónico",
            align: "start",
            sortable: true,
            value: "correoElectronico",
          },
          {
            text: "Fecha nacimiento",
            align: "start",
            sortable: true,
            value: "",
          },
          {
            text: "Estatus",
            align: "start",
            sortable: true,
            value: "estatusCliente",
          },
          {
            text: "Límite de crédito",
            align: "start",
            sortable: true,
            value: "limiteCredito",
          },
          {
            text: "Acciones",
            align: "center",
          },
        ],
        clients: [],
      },
      configModal: {
        openDialog: false,
        title: "",
        action: "",
        dataClient: {},
      },
    };
  },
  mounted() {
    this.getClients();
    EventBus.$on("saveClient", (data) => {
      this.configModal.action == "NEW"
        ? this.saveDataClient(data)
        : this.updateDataClient(data);
    });
  },
  methods: {
    getClients() {
      EventBus.$emit("loadingShow");
      ApiService.setHeader("Authorization", `bearer ${AuthService.getToken()}`);
      ApiService.get("/clientes")
        .then((result) => {
          result.data.code === 200
            ? (this.infoTable.clients = result.data.data)
            : this.$toast.warning(result.data.message, "¡Atención!", {
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
    getDataClient(id) {
      EventBus.$emit("loadingShow");
      ApiService.setHeader("Authorization", `bearer ${AuthService.getToken()}`);
      ApiService.get(`/cliente/${parseInt(id)}`)
        .then((result) => {
          if (result.data.code === 200) {
            this.configModal.title = `Editar cliente: ${result.data.data.nombreCompleto}`;
            this.configModal.dataClient = result.data.data;
            this.configModal.action = "EDIT";
            this.configModal.openDialog = true;
          } else {
          }
          EventBus.$emit("loadingClose");
        })
        .catch((err) => {
          EventBus.$emit("loadingClose");
          this.$toast.error(err.toString(), "Error", {
            layout: 1,
          });
        });
    },
    saveDataClient(data) {
      EventBus.$emit("loadingShow");
      ApiService.setHeader("Authorization", `bearer ${AuthService.getToken()}`);
      ApiService.post(`/cliente`, data)
        .then((result) => {
          if (result.data.code === 200) {
            this.$toast.success(result.data.message, "¡Atención!", {
              layout: 1,
            });
            +this.getClients();
          } else {
            this.$toast.warning(result.data.message, "¡Atención!", {
              layout: 1,
            });
          }
          EventBus.$emit("loadingClose");
        })
        .catch((err) => {
          EventBus.$emit("loadingClose");
          this.$toast.error(err.toString(), "Error", {
            layout: 1,
          });
        });
    },
    updateDataClient(data) {
      EventBus.$emit("loadingShow");
      ApiService.setHeader("Authorization", `bearer ${AuthService.getToken()}`);
      ApiService.put(`/cliente/${data.clienteId}`, data)
        .then((result) => {
          if (result.data.code === 200) {
            this.$toast.success(result.data.message, "¡Atención!", {
              layout: 1,
            });
            +this.getClients();
          } else {
            this.$toast.warning(result.data.message, "¡Atención!", {
              layout: 1,
            });
          }
          EventBus.$emit("loadingClose");
        })
        .catch((err) => {
          EventBus.$emit("loadingClose");
          this.$toast.error(err.toString(), "Error", {
            layout: 1,
          });
        });
    },
    deleteClient(id) {
      EventBus.$emit("loadingShow");
      ApiService.setHeader("Authorization", `bearer ${AuthService.getToken()}`);
      ApiService.delete(`/cliente/${parseInt(id)}`)
        .then((result) => {
          if (result.data.code === 200) {
            this.$toast.success(result.data.message, "¡Atención!", {
              layout: 1,
            });
            +this.getClients();
          } else {
            this.$toast.warning(result.data.message, "¡Atención!", {
              layout: 1,
            });
          }
          EventBus.$emit("loadingClose");
        })
        .catch((err) => {
          EventBus.$emit("loadingClose");
          this.$toast.error(err.toString(), "Error", {
            layout: 1,
          });
        });
    },
    questionDelete(id, nombre) {
      let vm = this;
      this.$toast.question(
        `¿Esta seguro que desea eliminar al cliente ${nombre}?`,
        "Eliminar",
        {
          timeout: 20000,
          close: true,
          overlay: true,
          toastOnce: true,
          id: "deleteClient",
          zindex: 999,
          position: "center",
          buttons: [
            [
              "<button><b>Sí</b></button>",
              function (instance, toast) {
                instance.hide({ transitionOut: "fadeOut" }, toast, "button");
                vm.deleteClient(parseInt(id));
              },
              true,
            ],
            [
              "<button>No</button>",
              function (instance, toast) {
                instance.hide({ transitionOut: "fadeOut" }, toast, "button");
              },
            ],
          ],
        }
      );
    },
  },
};
</script>

<style lang="">
.theme--light.v-data-table > .v-data-table__wrapper > table > thead > tr > th {
  color: rgb(255, 255, 255);
  background: black;
}
.theme--light.v-data-table .v-data-table-header th.sortable.active,
.theme--light.v-data-table
  .v-data-table-header
  th.sortable.active
  .v-data-table-header__icon,
.theme--light.v-data-table .v-data-table-header th.sortable:hover {
  color: rgb(255, 255, 255);
}
</style>