<template>
  <v-card flat>
    <v-card-title>Responsables</v-card-title>
    <template v-slot:text>
      <v-text-field v-model="search" label="Buscar" prepend-inner-icon="mdi-magnify" single-line variant="outlined"
        hide-details></v-text-field>
    </template>

    <v-container>
      <v-btn class="mb-2 mr-2" color="primary" @click="showNewDialog = true">
        New Item
      </v-btn>
      <v-btn class="mb-2 mr-2" color="secondary" @click="showUpdateDialog = true">
        Update Item
      </v-btn>
      <v-btn class="mb-2" color="red" @click="showDeleteDialog = true">
        Delete Item
      </v-btn>
    </v-container>

    <v-data-table :headers="headers" :items="datos" :search="search" :sort-by="[{ key: 'id', order: 'asc' }]"
      :sort-by1="[{ key: 'title', order: 'asc' }]" :sort-by2="[{ key: 'body', order: 'asc' }]"></v-data-table>

    <!-- Diálogo para introducir ID a eliminar -->
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

    <!-- Diálogo para introducir nuevos datos -->
    <v-dialog v-model="showNewDialog" max-width="500px">
      <v-card>
        <v-card-title>Nuevo Elemento</v-card-title>
        <v-card-text>
          <v-text-field v-model.number="newId" label="ID" type="number"></v-text-field>
          <v-text-field v-model.number="newNumEmpleado" label="Número de Empleado" type="number"></v-text-field>
          <v-text-field v-model="newNombre" label="Nombre"></v-text-field>
          <v-file-input v-model="newImagenResponsable" label="Imagen Responsable" @change="previewImage"></v-file-input>
          <img :src="imagePreview" v-if="imagePreview" alt="Preview" style="max-width: 50%; max-height: 300px;">
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="crearNuevoItem">Crear</v-btn>
          <v-btn text @click="showNewDialog = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo para actualizar datos -->
    <v-dialog v-model="showUpdateDialog" max-width="500px">
      <v-card>
        <v-card-title>Actualizar Elemento</v-card-title>
        <v-card-text>
          <v-text-field v-model.number="updateId" label="ID" type="number" @input="cargarDatosUpdate"></v-text-field>
          <v-text-field v-model.number="updateNumEmpleado" label="Número de Empleado" type="number"></v-text-field>
          <v-text-field v-model="updateNombre" label="Nombre"></v-text-field>
          <v-file-input v-model="updateImagenResponsable" label="Imagen Responsable"
            @change="previewImage"></v-file-input>
          <img :src="imagePreview" v-if="imagePreview" alt="Preview" style="max-width: 50%; max-height: 300px;">
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
  { key: 'numEmpleado', title: 'Número de empleado' },
  { key: 'nombre', title: 'Nombre' },
  { key: 'imagen', title: 'Imagen' },
]);

const datos = ref([]);

const imagePreview = ref('');

//para borrar
const showDeleteDialog = ref(false);
const idToDelete = ref('');

//para nuevo dato
const showNewDialog = ref(false);
const newId = ref('');
const newNumEmpleado = ref('');
const newNombre = ref('');
const newImagenResponsable = ref(null);

//para nuevo dato
const showUpdateDialog = ref(false);
const updateId = ref('');
const updateNumEmpleado = ref('');
const updateNombre = ref('');
const updateImagenResponsable = ref(null);

async function obtenerDatos() {
  try {
    const response = await fetch("https://localhost:4000/responsables", {
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
    const response = await fetch(`https://localhost:4000/responsables/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('jwtToken')}` }
    });
    obtenerDatos();

  } catch (error) {
    console.error('Error al crear el delete:', error);
  }
}

async function crearNuevoItem() {
  const formData = new FormData();
  formData.append('numEmpleado', newNumEmpleado.value);
  formData.append('nombre', newNombre.value);
  if (newImagenResponsable.value) {
    formData.append('imagen', newImagenResponsable.value[0]);
  }
  try {
    const response = await fetch('https://localhost:4000/responsables', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
      },
    });
    showNewDialog.value = false;
    obtenerDatos();
  } catch (error) {
    console.error('Error al crear el nuevo post:', error);
  }
}

async function actualizarItem() {
  const formData = new FormData();
  formData.append('numEmpleado', updateNumEmpleado.value);
  formData.append('nombre', updateNombre.value);
  if (newImagenResponsable.value) {
    formData.append('imagen', updateImagenResponsable.value[0]);
  }
  try {
    const response = await fetch(`https://localhost:4000/responsables/${updateId.value}`, {
      method: 'PUT',
      body: JSON.stringify({
        id: updateId.value,
        numEmpleado: updateNumEmpleado.value,
        nombre: updateNombre.value,
        imagen: formData,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
      },
    });
    showUpdateDialog.value = false;
    obtenerDatos();
  } catch (error) {
    console.error('Error al crear el nuevo post:', error);
  }
}

async function cargarDatosUpdate() {
  try {
    const response = await fetch(`https://localhost:4000/responsables/${updateId.value}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('jwtToken')}` }
    });
    const data = await response.json();
    updateNumEmpleado.value = data.numEmpleado;
    updateNombre.value = data.nombre;
    updateImagenResponsable.value = data.imagen;
  } catch (error) {
    console.error('Error al cargar los datos para actualizar:', error);
  }
}

function previewImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      imagePreview.value = reader.result;
    };
    reader.readAsDataURL(file);
  } else {
    imagePreview.value = '';
  }
}

obtenerDatos();
</script>