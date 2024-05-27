<template>
    <v-card flat>
        <v-card-title>Activos Tags</v-card-title>
        <template v-slot:text>
            <v-text-field v-model="search" label="Buscar" prepend-inner-icon="mdi-magnify" single-line
                variant="outlined" hide-details></v-text-field>
        </template>

        <v-container>
            <v-btn class="mb-2 mr-2" color="primary" @click="showNewDialog = true">
                New Item
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
                    <v-text-field v-model.number="deleteActivoId" label="Número de Serie" type="number"></v-text-field>
                    <v-text-field v-model.number="deleteTagId" label="Número de Inventario"
                        type="number"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="red darken-1" text
                        @click="eliminar(idToDelete); showDeleteDialog = false">Eliminar</v-btn>
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
                    <v-text-field v-model.number="newActivoId" label="Número de Serie" type="number"></v-text-field>
                    <v-text-field v-model.number="newTagId" label="Número de Inventario" type="number"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="primary" @click="crearNuevoItem">Crear</v-btn>
                    <v-btn text @click="showNewDialog = false">Cancelar</v-btn>
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
    { key: 'activoId', title: 'Activo Id' },
    { key: 'tagId', title: 'Tag id' },
]);

const datos = ref([]);

//para borrar
const showDeleteDialog = ref(false);
const deleteActivoId = ref('');
const deleteTagId = ref('');

//para nuevo dato
const showNewDialog = ref(false);
const newId = ref('');
const newActivoId = ref('');
const newTagId = ref('');

async function obtenerDatos() {
    try {
        const response = await fetch("https://localhost:4000/activoTags", {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('jwtToken')}` }
        });
        const data = await response.json();
        datos.value = data;
        console.log(datos.value);
    } catch (error) {
        console.error('Error al obtener datos:', error);
    }
}

async function eliminar() {
    try {
        const response = await fetch(`https://localhost:4000/activoTags/desasignar`, {
            method: 'DELETE',
            body: JSON.stringify({
                activoId: deleteActivoId.value,
                tagId: deleteTagId.value,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            },
        });
        obtenerDatos();

    } catch (error) {
        console.error('Error al crear el delete:', error);
    }
}

async function crearNuevoItem() {
    try {
        const response = await fetch('https://localhost:4000/activoTags/asignar', {
            method: 'POST',
            body: JSON.stringify({
                activoId: newActivoId.value,
                tagId: newTagId.value,
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

obtenerDatos();
</script>