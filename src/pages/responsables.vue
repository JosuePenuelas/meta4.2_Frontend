<template>
  <v-card flat>
    <v-card-title>Responsables</v-card-title>
    <template v-slot:text>
      <v-text-field v-model="search" label="Buscar" prepend-inner-icon="mdi-magnify" single-line variant="outlined" hide-details></v-text-field>
    </template>

    <v-container>
      <v-btn class="mb-2 mr-2" color="primary" @click="openDialog('create')">
        New Item
      </v-btn>
      <v-btn class="mb-2 mr-2" color="secondary" @click="openDialog('update')">
        Update Item
      </v-btn>
      <v-btn class="mb-2" color="red" @click="showDeleteDialog = true">
        Delete Item
      </v-btn>
    </v-container>

    <v-data-table :headers="headers" :items="datos" :search="search" :sort-by="[{ key: 'id', order: 'asc' }]" :sort-by1="[{ key: 'title', order: 'asc' }]" :sort-by2="[{ key: 'body', order: 'asc' }]"></v-data-table>

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
          <v-text-field v-model.number="formData.id" v-if="dialogMode === 'update'" label="ID" type="number" @input="cargarDatosUpdate"></v-text-field>
          <v-text-field v-model.number="formData.numEmpleado" label="Número de Empleado" type="number"></v-text-field>
          <v-text-field v-model="formData.nombre" label="Nombre"></v-text-field>
          <v-file-input v-model="formData.imagen" label="Imagen Responsable" @change="previewImage"></v-file-input>
          <img :src="imagePreview" v-if="imagePreview" alt="Preview" style="max-width: 50%; max-height: 300px;">
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
  { key: 'numEmpleado', title: 'Número de serie' },
  { key: 'nombre', title: 'Número de inventario' },
  { key: 'imagen', title: 'Imagen' },
]);

const datos = ref([]);

const imagePreview = ref('');
const formData = ref({
  id: '',
  numEmpleado: '',
  nombre: '',
  imagen: null,
});

const dialogMode = ref('create');
const showDialog = ref(false);

// Para eliminar
const showDeleteDialog = ref(false);
const idToDelete = ref('');

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
    await fetch(`https://localhost:4000/responsables/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('jwtToken')}` }
    });
    obtenerDatos();
  } catch (error) {
    console.error('Error al eliminar el elemento:', error);
  }
}

async function crearNuevoItem() {
  try {
    const form = new FormData();
    form.append('imagen', formData.value.imagen);
    const response = await fetch('https://localhost:4000/responsables', {
      method: 'POST',
      body: JSON.stringify({
        id: formData.value.id,
        numEmpleado: formData.value.numEmpleado,
        nombre: formData.value.nombre,
        imagen: form,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
      },
    });
    showDialog.value = false;
    obtenerDatos();
  } catch (error) {
    console.error('Error al crear el nuevo post:', error);
  }
}

async function actualizarItem() {
  try {
    const form = new FormData();
    form.append('imagen', formData.value.imagen);
    const response = await fetch(`https://localhost:4000/responsables/${formData.value.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        id: formData.value.id,
        numEmpleado: formData.value.numEmpleado,
        nombre: formData.value.nombre,
        imagen: form,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
      },
    });
    showDialog.value = false;
    obtenerDatos();
  } catch (error) {
    console.error('Error al actualizar el elemento:', error);
  }
}

async function cargarDatosUpdate() {
  try {
    const response = await fetch(`https://localhost:4000/responsables/${formData.value.id}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('jwtToken')}` }
    });
    const data = await response.json();
    formData.value.numEmpleado = data.numEmpleado;
    formData.value.nombre = data.nombre;
    formData.value.imagen = data.imagen;
    imagePreview.value = data.imagen ? `https://localhost:4000/${data.imagen}` : '';
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

function openDialog(mode) {
  dialogMode.value = mode;
  if (mode === 'create') {
    formData.value.id = '';
    formData.value.numEmpleado = '';
    formData.value.nombre = '';
    formData.value.imagen = null;
    imagePreview.value = '';
  } else if (mode === 'update') {
    cargarDatosUpdate();
  }
  showDialog.value = true;
}

obtenerDatos();
</script>
