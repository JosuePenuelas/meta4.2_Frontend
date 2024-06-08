<template>
  <div id="app">
    <v-app>
      <v-container fluid pa-0>
        <v-row align="center" justify="center" style="height:100vh" dense>
          <v-col cols="12" lg="6" md="6"
            class="grey lighten-2 fill-height d-flex flex-column justify-center align-center">
            <v-card title="Servicio web REST de activos" variant="outlined" width="400" class="mt-16" color="indigo">
              <v-card-text>
                Servicio web REST para manipular los siguientes recursos relacionados con un sistema de control de activos:<br>
                Activos, Ubicaciones y Responsables.
                <br><br>
                Inicia sesión o registrate para poder hacer uso de este sistema
              </v-card-text>
              <v-card-actions>
                <v-btn @click="ingresar" append-icon="mdi-google">
                  Inicia o registrate con Google
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-app>
  </div>
</template>

<script setup>
const ingresar = async () => {
  window.location.href = 'https://localhost:4000/auth/google/';
};
</script>
