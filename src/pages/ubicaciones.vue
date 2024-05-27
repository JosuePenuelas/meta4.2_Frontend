<template>
  <v-card flat>
    <v-card-title>Ubicaciones</v-card-title>
    <template v-slot:text>
      <v-text-field v-model="search" label="Buscar" prepend-inner-icon="mdi-magnify" single-line variant="outlined" hide-details></v-text-field>
    </template>

    <v-container>
      <v-btn class="mb-2 mr-2" color="primary" @click="openDialog('create')">New Item</v-btn>
      <v-btn class="mb-2 mr-2" color="secondary" @click="openDialog('update')">Update Item</v-btn>
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

    <!-- Diálogo para crear/actualizar -->
    <v-dialog v-model="showDialog" max-width="500px">
      <v-card>
        <v-card-title>{{ dialogMode === 'create' ? 'Nuevo Elemento' : 'Actualizar Elemento' }}</v-card-title>
        <v-card-text>
          <v-text-field v-if="dialogMode === 'update'" v-model.number="formData.id" label="ID" type="number" @input="cargarDatosUpdate"></v-text-field>
          <v-text-field v-model="formData.descripcion" label="Descripción"></v-text-field>
          <v-file-input v-model="formData.imagen" label="Imagen Ubicación" accept="image/*" @change="renderImg"></v-file-input>
          <v-img v-if="imgUrl" :src="imgUrl" aspect-ratio="16/9"></v-img>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="dialogMode === 'create' ? crearNuevoItem() : actualizarItem()">Guardar</v-btn>
          <v-btn text @click="showDialog = false">Cancelar</v-btn>
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
  { key: 'imagen', title: 'Imagen' },
]);

const datos = ref([]);

// Consolidación de variables en formData
const formData = ref({
  id: '',
  descripcion: '',
  imagen: null,
});

// Variables de control de diálogos y modo
const dialogMode = ref('create');
const showDialog = ref(false);
const showDeleteDialog = ref(false);

// ID para eliminar
const idToDelete = ref('');

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
  const formDataObject = new FormData();
  formDataObject.append('descripcion', formData.value.descripcion);
  if (formData.value.imagen) {
    formDataObject.append('imagen', formData.value.imagen);
  }

  try {
    await fetch('https://localhost:4000/ubicaciones', {
      method: 'POST',
      body: formDataObject,
      headers: { 'Authorization': `Bearer ${localStorage.getItem('jwtToken')}` }
    });
    showDialog.value = false;
    obtenerDatos();
  } catch (error) {
    console.error('Error al crear el nuevo elemento:', error);
  }
}

async function actualizarItem() {
  const formDataObject = new FormData();
  formDataObject.append('descripcion', formData.value.descripcion);
  if (formData.value.imagen) {
    formDataObject.append('imagen', formData.value.imagen);
  }

  try {
    await fetch(`https://localhost:4000/ubicaciones/${formData.value.id}`, {
      method: 'PUT',
      body: formDataObject,
      headers: { 'Authorization': `Bearer ${localStorage.getItem('jwtToken')}` }
    });
    showDialog.value = false;
    obtenerDatos();
  } catch (error) {
    console.error('Error al actualizar el elemento:', error);
  }
}

async function cargarDatosUpdate() {
  try {
    const response = await fetch(`https://localhost:4000/ubicaciones/${formData.value.id}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('jwtToken')}` }
    });
    const data = await response.json();
    formData.value.descripcion = data.descripcion;
    imgUrl.value = data.imagen ? `https://localhost:4000/${data.imagen}` : '';
  } catch (error) {
    console.error('Error al cargar los datos para actualizar:', error);
  }
}

const renderImg = (event) => {
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

function openDialog(mode) {
  dialogMode.value = mode;
  if (mode === 'create') {
    formData.value.id = '';
    formData.value.descripcion = '';
    formData.value.imagen = null;
    imgUrl.value = '';
  } else if (mode === 'update') {
    formData.value.id = '';
    showDialog.value = true;
  }
}

obtenerDatos();
</script>
