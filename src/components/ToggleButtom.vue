<template>
    <label class="switch">
        <input type="checkbox" :checked="modelValue === 'active' ? true : false" @change="onToggle" />
        <span class="slider"></span>
    </label>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    modelValue: String,
});

const emit = defineEmits(['update:modelValue']);

function onToggle(event) {
    const status = event.target.checked ? 'active' : 'inactive';
    console.log(event.target.checked)
    emit('update:modelValue', status);
}
</script>

<style scoped>
.switch {
    position: relative;
    display: inline-block;
    width: 28px;
    height: 16px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.4s;
    border-radius: 34px;
}

.slider:before {
    position: absolute;
    content: "";
    height: 10px;
    width: 10px;
    left: 4px;
    top: 3px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
}

input:checked+.slider {
    background-color: #2962ff;
}

input:checked+.slider:before {
    transform: translateX(11px);
}
</style>