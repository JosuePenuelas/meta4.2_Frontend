<template>
  <v-app>
    <v-card>
      <v-layout>
        <v-navigation-drawer expand-on-hover rail color="indigo">
          <v-list>
            <v-list-item prepend-icon="mdi-vuetify" title="Servicio Web REST"
              subtitle="Sistema De Control De Activos"></v-list-item>
            <v-list-item v-if="isAuthenticated">
              <v-list-item-content>
                <v-list-item-title class="white--text"><span v-text="nombreUsuario"></span></v-list-item-title>
                <v-list-item-title class="white--text"><span v-text="correo"></span></v-list-item-title>
              </v-list-item-content>
            </v-list-item>

          </v-list>

          <v-divider></v-divider>

          <v-list density="compact" nav>
            <v-list-item v-if="!isAuthenticated" prepend-icon="mdi-home" link to="/" title="Inicio"></v-list-item>
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

        <v-main style="height: 900px; width: 450px;">
          <RouterView />
        </v-main>
      </v-layout>
    </v-card>

    <v-footer app color="indigo-accent-2" class="white--text">
      <v-col class="text-center">
        &copy; {{ new Date().getFullYear() }} - Control de Activos
      </v-col>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const nombreUsuario = ref('');
const correo = ref('');
const isAuthenticated = ref(false);

const ingresar = async () => {
  window.location.href = 'https://localhost:4000/auth/google/';
};

const cerrarSesion = async () => {
  localStorage.removeItem('jwtToken');
  localStorage.removeItem('nombreUsuario');
  localStorage.removeItem('correo');
  isAuthenticated.value = false;
  nombreUsuario.value = '';
  correo.value = '';
  window.location.href = '/';
};

const handleGoogleCallback = async () => {
  const query = new URLSearchParams(window.location.search);
  const token = query.get('token');
  const name = query.get('name');
  const correoValue = query.get('correo');  // Cambié el nombre de la variable para evitar conflictos

  console.log(`token: ${token}`);
  console.log(`name: ${name}`);
  console.log(`correo: ${correoValue}`);  // Agregar para debug

  if (token && name && correoValue) {  // Asegúrate de incluir correo en la condición
    localStorage.setItem('jwtToken', token);
    localStorage.setItem('nombreUsuario', decodeURIComponent(name));
    localStorage.setItem('correo', decodeURIComponent(correoValue));  // Corregido esta línea
    nombreUsuario.value = decodeURIComponent(name);
    correo.value = decodeURIComponent(correoValue);
    isAuthenticated.value = true;
    $router.push("/activos");
  }
};

const initializeAuthentication = async () => {
  const storedName = localStorage.getItem('nombreUsuario');
  const storedCorreo = localStorage.getItem('correo');
  if (storedName) {
    nombreUsuario.value = storedName;
  }
  if (storedCorreo) {
    correo.value = storedCorreo;
  }
  if (storedName || storedCorreo) {
    isAuthenticated.value = true;
  }
  await handleGoogleCallback();
};

onMounted(async () => {
  console.log('Componente montado');
  await initializeAuthentication();
  console.log('Estado después de inicialización:');
  console.log(`isAuthenticated: ${isAuthenticated.value}`);
  console.log(`nombreUsuario: ${nombreUsuario.value}`);
  console.log(`correo: ${correo.value}`);
});



</script>
