<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer expand-on-hover rail color="indigo">
        <v-list>
          <v-list-item prepend-icon="mdi-vuetify" title="Servicio Web REST"
            subtitle="Sistema De Control De Activos"></v-list-item>
          <v-list-item v-if="isAuthenticated">
            <v-list-item-content>
              <v-list-item-title class="white--text"><span v-text="nombreUsuario"></span></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-item prepend-icon="mdi-home" link to="/" title="Inicio"></v-list-item>
          <v-list-item v-if="isAuthenticated" prepend-icon="mdi-alpha-a-box" link to="/activos"
            title="Activos"></v-list-item>
          <v-list-item v-if="isAuthenticated" prepend-icon="mdi-tag-multiple" link to="/tags"
            title="Tags"></v-list-item>
          <v-list-item v-if="isAuthenticated" prepend-icon="mdi-audio-input-xlr" link to="/activoTags"
            title="ActivoTags"></v-list-item>
          <v-list-item v-if="isAuthenticated" prepend-icon="mdi-account" link to="/responsables"
            title="Responsables"></v-list-item>
          <v-list-item v-if="isAuthenticated" prepend-icon="mdi-sitemap" link to="/ubicaciones"
            title="Ubicaciones"></v-list-item>
          <v-list-item v-if="!isAuthenticated" prepend-icon="mdi-login" @click="ingresar"
            title="Autentificación"></v-list-item>
          <v-list-item v-if="isAuthenticated" prepend-icon="mdi-logout" @click="cerrarSesion"
            title="Cerrar Sesión"></v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main style="height: auto; width: auto;">
        <RouterView />
      </v-main>
    </v-layout>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const nombreUsuario = ref('');
const isAuthenticated = ref(false);

const ingresar = async () => {
  window.location.href = 'https://localhost:4000/auth/google/';
};

const cerrarSesion = async () => {
  localStorage.removeItem('jwtToken');
  localStorage.removeItem('nombreUsuario');
  isAuthenticated.value = false;
  nombreUsuario.value = '';
  window.location.href = '/';
};

const handleGoogleCallback = async () => {
  const query = new URLSearchParams(window.location.search);
  const token = query.get('token');
  const name = query.get('name');

  console.log(`token: ${token}`)
  console.log(`name: ${name}`)

  if (token && name) {
    localStorage.setItem('jwtToken', token);
    localStorage.setItem('nombreUsuario', decodeURIComponent(name));
    nombreUsuario.value = decodeURIComponent(name);
    isAuthenticated.value = true;
    $router.push("/");
  }
};

onMounted(async () => {
  const storedName = localStorage.getItem('nombreUsuario');
  if (storedName) {
    nombreUsuario.value = storedName;
    isAuthenticated.value = true;
  }
  await handleGoogleCallback();
});

</script>
