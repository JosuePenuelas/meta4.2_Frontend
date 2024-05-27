<template>
    <v-card flat>
        <v-card-title>Activos</v-card-title>
        <template v-slot:text>
            <v-text-field v-model="search" label="Buscar" prepend-inner-icon="mdi-magnify" single-line
                variant="outlined" hide-details></v-text-field>
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

        <v-data-table :headers="headers" :items="datos" :search="search" :sort-by="[{ key: 'id', order: 'asc' }]"
            :sort-by1="[{ key: 'title', order: 'asc' }]" :sort-by2="[{ key: 'body', order: 'asc' }]"></v-data-table>

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
                    <v-text-field v-model.number="itemId" v-if="dialogMode === 'update'" label="ID" type="number" @input="cargarDatosUpdate"></v-text-field>
                    <v-text-field v-model.number="itemNumSerie" label="Número de Serie" type="number"></v-text-field>
                    <v-text-field v-model.number="itemNumInv" label="Número de Inventario" type="number"></v-text-field>
                    <v-text-field v-model="itemDesc" label="Descripción"></v-text-field>
                    <v-text-field v-model="itemUbicacion" label="Ubicación"></v-text-field>
                    <v-text-field v-model="itemResponsable" label="Responsable"></v-text-field>
                    <v-file-input prepend-icon="mdi-camera" v-model="itemImagen" label="Imagen" accept="image/*" @change="renderImg"></v-file-input>
                    <v-img :src="imgUrl"></v-img>
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
    { key: 'numSerie', title: 'Número de serie' },
    { key: 'numInventario', title: 'Número de inventario' },
    { key: 'descripcion', title: 'Descripción' },
    { key: 'ubicacion', title: 'Ubicación' },
    { key: 'responsable', title: 'Responsable' },
    { key: 'imagen', title: 'Imagen' },
]);

const datos = ref([]);
const showDialog = ref(false);
const dialogMode = ref('create');
const itemId = ref('');
const itemNumSerie = ref('');
const itemNumInv = ref('');
const itemDesc = ref('');
const itemUbicacion = ref('');
const itemResponsable = ref('');
const itemImagen = ref(null);
const imgUrl = ref("");

// Para eliminar
const showDeleteDialog = ref(false);
const idToDelete = ref('');

async function obtenerDatos() {
    try {
        const response = await fetch("https://localhost:4000/activos", {
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
        await fetch(`https://localhost:4000/activos/${id}`, {
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
    formData.append('numSerie', itemNumSerie.value);
    formData.append('numInventario', itemNumInv.value);
    formData.append('descripcion', itemDesc.value);
    formData.append('ubicacion', itemUbicacion.value);
    formData.append('responsable', itemResponsable.value);
    if (itemImagen.value) {
        formData.append('imagen', itemImagen.value[0]);
    }

    try {
        await fetch('https://localhost:4000/activos', {
            method: 'POST',
            body: formData,
            headers: { 'Authorization': `Bearer ${localStorage.getItem('jwtToken')}` }
        });
        showDialog.value = false;
        obtenerDatos();
    } catch (error) {
        console.error('Error al crear el nuevo elemento:', error);
    }
}

async function actualizarItem() {
    const formData = new FormData();
    formData.append('numSerie', itemNumSerie.value);
    formData.append('numInventario', itemNumInv.value);
    formData.append('descripcion', itemDesc.value);
    formData.append('ubicacion', itemUbicacion.value);
    formData.append('responsable', itemResponsable.value);
    if (itemImagen.value) {
        formData.append('imagen', itemImagen.value[0]);
    }

    try {
        await fetch(`https://localhost:4000/activos/${itemId.value}`, {
            method: 'PUT',
            body: formData,
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
        const response = await fetch(`https://localhost:4000/activos/${itemId.value}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('jwtToken')}` }
        });
        const data = await response.json();
        itemNumSerie.value = data.numSerie;
        itemNumInv.value = data.numInventario;
        itemDesc.value = data.descripcion;
        itemUbicacion.value = data.ubicacion;
        itemResponsable.value = data.responsable;
        imgUrl.value = data.imagen ? `https://localhost:4000/${data.imagen}` : '';
    } catch (error) {
        console.error('Error al cargar los datos para actualizar:', error);
    }
}

function openDialog(mode) {
    dialogMode.value = mode;
    if (mode === 'create') {
        itemId.value = '';
        itemNumSerie.value = '';
        itemNumInv.value = '';
        itemDesc.value = '';
        itemUbicacion.value = '';
        itemResponsable.value = '';
        itemImagen.value = null;
        imgUrl.value = '';
    } else if (mode === 'update') {
        cargarDatosUpdate();
    }
    showDialog.value = true;
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

obtenerDatos();
</script>
