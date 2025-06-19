<template>
  <section>
    <q-table flat separator="none" table-header-class="control-table-header" :rows="dataClients || []"
      :columns="columns" row-key="id" v-model:pagination="props.paginationClients"
      rowsPerPageLabel="Registros por página" no-data-label="No se ha encontrado datos" hide-pagination>
      <template #body-cell-avatar="props">
        <td :props="props" style="width: 50px">
          <q-avatar size="40px">
            <template v-if="props.row.images && props.row.images.length">
              <img :src="`${pathImage}${props.row.images[0].path}`" alt="Avatar" />
            </template>
            <template v-else>
              <span>{{ getInitials(props.row.name) }}</span>
            </template>
          </q-avatar>
        </td>
      </template>
      <template #body-cell-active="props">
        <td :props="props" style="width: 80px">
          <q-toggle v-model="props.row.status" true-value="active" false-value="inactive" color="primary"
            @update:model-value="$emit('toggle-member', props.row)" />
        </td>
      </template>

      <template #body-cell-address="props">
        <td :props="props">
          <div class="text-sm text-gray-900">
            {{ props.row.address }}
          </div>
          <div class="text-sm text-gray-500">{{ props.row.city }}</div>
        </td>
      </template>
      <template #body-cell-routes="props">
        <td :props="props">
          <div v-if="props.row.routes.length">
            <div v-for="route in props.row.routes" :key="route.id">
              <div class="text-sm text-gray-900">{{ route.name }}</div>
              <div class="text-sm text-gray-500">{{ route.sector }}</div>
            </div>
          </div>
          <div v-else class="text-sm text-gray-500"></div>
        </td>
      </template>
      <template #body-cell-email="props">
        <td :props="props">
          <div class="text-sm text-blue-600">{{ props.row.email }}</div>
        </td>
      </template>

      <template #body-cell-created_at="props">
        <td :props="props">
          <div class="text-sm text-gray-900">
            {{ date.formatDate(props.row.created_at, "DD-MM-YYYY ") }}
          </div>
        </td>
      </template>
      <template #body-cell-images="props">
        <td :props="props">
          <q-btn flat dense color="primary" @click="showImages(props.row.images)">
            Imágenes
          </q-btn>
        </td>
      </template>
      <template #body-cell-opt="props">
        <td :props="props" style="width: 130px">
          <div class="flex justify-end items-center q-gutter-x-xs">
            <q-btn flat dense color="primary" @click="$emit('edit', props.row)">
              <img src="/icons/edit.svg" alt="" />
            </q-btn>
            <q-btn flat dense color="negative" @click="$emit('confirm-delete-member', props.row)">
              <img src="/icons/trash-2.svg" alt="" />
            </q-btn>
          </div>
        </td>
      </template>
    </q-table>
    <q-dialog v-model="dialogVisible">
      <q-card style="" class="carrousel-image q-pa-md">
        <q-card-section class="flex justify-between items-center">
          <h3 class="text-lg font-medium">Fotos del Cliente</h3>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-carousel v-if="selectedImages.length" v-model="selectedImageIndex" arrows infinite control-color="primary"
            control-type="push">
            <q-carousel-slide v-for="(image, index) in selectedImages" :key="index" :name="index"
              class="flex justify-center items-center">
              <img :src="`${pathImage}${image.path}`" alt="Client Image" />
            </q-carousel-slide>
          </q-carousel>
        </q-card-section>
      </q-card>
    </q-dialog>
    <div class="flex justify-end items-center q-mt-md">
      <q-pagination v-model="props.paginationClients.page" color="grey-9" active-color="primary" :max="maxPages"
        :max-pages="8" size="md" gutter="10px" direction-links icon-first="keyboard_double_arrow_left"
        icon-last="keyboard_double_arrow_right" icon-prev="chevron_left" icon-next="chevron_right"
        @update:model-value="sendEmitPagination" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { computed } from "vue";
import { MemberForm } from "src/types/members.types";
import { columns } from "./ColumnsClients";
import { ClientData } from "src/types/clients.types";
import { date } from "quasar";
import { pathImage } from "src/boot/axios";

const emits = defineEmits<{
  (e: "edit", client: any): void;
  (e: "confirm-delete-member", member: MemberForm): void;
  (e: "toggle-member", member: MemberForm): void;
  (e: "update-pagination", paginationMembers: any): void;
  (e: "show-create-modal"): void;
}>();

const props = defineProps<{
  dataClients: ClientData | any;
  paginationClients: any;
}>();

const dialogVisible = ref(false);
const selectedImages = ref<{ path: string }[]>([]);
const selectedImageIndex = ref(0);

const getImageSrc = (image: string | File) => {
  return typeof image === "string"
    ? `${pathImage}${image}`
    : URL.createObjectURL(image);
};

const showImages = (images: any) => {
  selectedImages.value = images.map((img: any) => getImageSrc(img.path));
  dialogVisible.value = true;
};

const getInitials = (name: string) => {
  const parts = name.split(" ");
  const initials = parts.map((part) => part.charAt(0)).join("");
  return initials.length > 2 ? initials.slice(0, 2) : initials;
};

const sendEmitPagination = () => {
  emits("update-pagination", props.paginationClients);
};

const maxPages = computed(() => {
  const calculatedPages = Math.ceil(
    props.dataClients.total / props.paginationClients.rowsPerPage,
  );
  return calculatedPages;
});
</script>

<style lang="scss" scoped>
.carrousel-image {
  max-width: 600px;
  max-height: 600px;
  width: 100%;
}
</style>
