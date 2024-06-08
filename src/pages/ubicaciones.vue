<template>
  <v-card flat>
    <v-card-title>Ubicaciones</v-card-title>
    <template v-slot:text>
      <v-text-field v-model="search" label="Buscar" prepend-inner-icon="mdi-magnify" single-line variant="outlined"
        hide-details></v-text-field>
    </template>

    <v-container>
      <v-btn class="mb-2 mr-2" color="primary" @click="showNewDialog = true">New Item</v-btn>
      <v-btn class="mb-2 mr-2" color="secondary" @click="showUpdateDialog = true">Update Item</v-btn>
      <v-btn class="mb-2" color="red" @click="showDeleteDialog = true">Delete Item</v-btn>
    </v-container>

    <v-data-table :headers="headers" :items="datos" :search="search"></v-data-table>

    <!-- Diálogo para eliminar -->
    <v-dialog v-model="showDeleteDialog" max-width="500px">
      <v-card>
        <v-card-title>Eliminar Elemento</v-card-title>
        <v-card-text>
          <v-text-field v-model.number="idToDelete" label="ID a eliminar" type="number"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="red darken-1" text @click="eliminar(idToDelete); showDeleteDialog = false">Eliminar</v-btn>
          <v-btn text @click="showDeleteDialog = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo para nuevo elemento -->
    <v-dialog v-model="showNewDialog" max-width="500px">
      <v-card>
        <v-card-title>Nuevo Elemento</v-card-title>
        <v-card-text>
          <v-text-field v-model="newDescripcion" label="descripcion"></v-text-field>
          <v-file-input v-model="newImagenUbi" label="Imagen Ubicación" accept="image/*"
            @change="renderImg($event, 'new')"></v-file-input>
          <v-img v-if="imgUrl" :src="imgUrl" aspect-ratio="16/9"></v-img>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="crearNuevoItem">Crear</v-btn>
          <v-btn text @click="showNewDialog = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo para actualizar elemento -->
    <v-dialog v-model="showUpdateDialog" max-width="500px">
      <v-card>
        <v-card-title>Actualizar Elemento</v-card-title>
        <v-card-text>
          <v-text-field v-model.number="updateId" label="ID" type="number" @input="cargarDatosUpdate"></v-text-field>
          <v-text-field v-model="updateDescripcion" label="descripcion"></v-text-field>
          <v-file-input v-model="updateImagenUbi" label="Imagen Ubicación" accept="image/*"
            @change="renderImg($event, 'update')"></v-file-input>
          <v-img v-if="imgUrl" :src="imgUrl" aspect-ratio="16/9"></v-img>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="actualizarItem">Actualizar</v-btn>
          <v-btn text @click="showUpdateDialog = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';

const search = ref('');
const headers = ref([
  { align: 'start', key: 'id', sortable: false, title: 'ID' },
  { key: 'descripcion', title: 'Descripción' },
  { key: 'Activos', title: 'activos' },
  { key: 'imagen', title: 'Imagen' },
]);

const datos = ref([]);

// Para eliminar
const showDeleteDialog = ref(false);
const idToDelete = ref('');

// Para nuevo dato
const showNewDialog = ref(false);
const newDescripcion = ref('');
const newImagenUbi = ref(null);

// Para actualizar
const showUpdateDialog = ref(false);
const updateId = ref('');
const updateDescripcion = ref('');
const updateImagenUbi = ref(null);

const imgUrl = ref("");

async function obtenerDatos() {
  try {
    const response = await fetch("https://localhost:4000/ubicaciones", {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('jwtToken')}` }
    });
    const data = await response.json();
    datos.value = data;
  } catch (error) {
    console.error('Error al obtener datos:', error);
  }
}

async function eliminar(id) {
  try {
    await fetch(`https://localhost:4000/ubicaciones/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('jwtToken')}` }
    });
    obtenerDatos();
  } catch (error) {
    console.error('Error al eliminar el elemento:', error);
  }
}

async function crearNuevoItem() {
  const formData = new FormData();
  formData.append('descripcion', newDescripcion.value);
  if (newImagenUbi.value) {
    formData.append('imagen', newImagenUbi.value[0]);
  }

  try {
    await fetch('https://localhost:4000/ubicaciones', {
      method: 'POST',
      body: formData,
      headers: { 'Authorization': `Bearer ${localStorage.getItem('jwtToken')}` }
    });
    showNewDialog.value = false;
    obtenerDatos();
  } catch (error) {
    console.error('Error al crear el nuevo elemento:', error);
  }
}

async function actualizarItem() {
  const formData = new FormData();
  formData.append('descripcion', updateDescripcion.value);
  if (updateImagenUbi.value) {
    formData.append('imagen', updateImagenUbi.value[0]);
  }

  try {
    await fetch(`https://localhost:4000/ubicaciones/${updateId.value}`, {
      method: 'PUT',
      body: formData,
      headers: { 'Authorization': `Bearer ${localStorage.getItem('jwtToken')}` }
    });
    showUpdateDialog.value = false;
    obtenerDatos();
  } catch (error) {
    console.error('Error al actualizar el elemento:', error);
  }
}

async function cargarDatosUpdate() {
  try {
    const response = await fetch(`https://localhost:4000/ubicaciones/${updateId.value}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('jwtToken')}` }
    });
    const data = await response.json();
    updateDescripcion.value = data.descripcion;
    imgUrl.value = data.imagen ? `https://localhost:4000/${data.imagen}` : '';
  } catch (error) {
    console.error('Error al cargar los datos para actualizar:', error);
  }
}

const renderImg = (event, type) => {
  const file = event.target.files[0];
  if (!file) {
    imgUrl.value = "";
    return;
  }
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    imgUrl.value = reader.result;
  };
};

obtenerDatos();
</script>