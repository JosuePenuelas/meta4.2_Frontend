<template>
  <v-card flat>
    <v-card-title>Tags</v-card-title>
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
          <v-text-field v-model="newDescripcion" label="descripcion"></v-text-field>
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
          <v-text-field v-model="updateDescripcion" label="descripcion"></v-text-field>
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
  { key: 'descripcion', title: 'Descripcion' },
]);

const datos = ref([]);

//para borrar
const showDeleteDialog = ref(false);
const idToDelete = ref('');

//para nuevo dato
const showNewDialog = ref(false);
const newId = ref('');
const newDescripcion = ref('');

//para nuevo dato
const showUpdateDialog = ref(false);
const updateId = ref('');
const updateDescripcion = ref('');

async function obtenerDatos() {
  try {
    const response = await fetch("https://localhost:4000/tags", {
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
    const response = await fetch(`https://localhost:4000/tags/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('jwtToken')}` }
    });
    obtenerDatos();

  } catch (error) {
    console.error('Error al crear el delete:', error);
  }
}

async function crearNuevoItem() {
  try {
    const response = await fetch('https://localhost:4000/tags', {
      method: 'POST',
      body: JSON.stringify({
        id: newId.value,
        descripcion: newDescripcion.value,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
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
  try {
    const response = await fetch(`https://localhost:4000/tags/${updateId.value}`, {
      method: 'PUT',
      body: JSON.stringify({
        id: updateId.value,
        descripcion: updateDescripcion.value,
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
    const response = await fetch(`https://localhost:4000/tags/${updateId.value}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('jwtToken')}` }
    });
    const data = await response.json();
    updateDescripcion.value = data.descripcion;
  } catch (error) {
    console.error('Error al cargar los datos para actualizar:', error);
  }
}

obtenerDatos();
</script>