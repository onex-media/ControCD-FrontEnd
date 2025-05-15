<template>
    <div class="users-details__data">
        <article class="field-card">
            <div class="field-card__icon" aria-hidden="true">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 7V25" stroke="black" stroke-width="1.5" stroke-linecap="round"
                        stroke-linejoin="round" />
                    <path d="M6 11V7H26V11" stroke="black" stroke-width="1.5" stroke-linecap="round"
                        stroke-linejoin="round" />
                    <path d="M12 25H20" stroke="black" stroke-width="1.5" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
            </div>
            <section class="field-card__content">
                <h2 class="field-card__label">Nombre</h2>
                <p class="field-card__description">{{ user?.name }}</p>
            </section>
        </article>
        <article class="field-card">
            <div class="field-card__icon" aria-hidden="true">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M16 21C18.2091 21 20 19.2091 20 17C20 14.7909 18.2091 13 16 13C13.7909 13 12 14.7909 12 17C12 19.2091 13.7909 21 16 21Z"
                        stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path
                        d="M10 24C10.6986 23.0685 11.6045 22.3125 12.6459 21.7918C13.6873 21.2711 14.8357 21 16 21C17.1643 21 18.3127 21.2711 19.3541 21.7918C20.3955 22.3125 21.3014 23.0685 22 24"
                        stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path
                        d="M26 27V5C26 4.44772 25.5523 4 25 4L7 4C6.44772 4 6 4.44772 6 5V27C6 27.5523 6.44772 28 7 28H25C25.5523 28 26 27.5523 26 27Z"
                        stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M12 8H20" stroke="black" stroke-width="1.5" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
            </div>
            <section class="field-card__content">
                <h2 class="field-card__label">Cédula</h2>
                <p class="field-card__description">{{ user?.dni }}</p>
            </section>
        </article>
        <article class="field-card">
            <div class="field-card__icon" aria-hidden="true">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M25.5 19H5C4.73478 19 4.48043 18.8946 4.29289 18.7071C4.10536 18.5196 4 18.2652 4 18V10C4 9.73478 4.10536 9.48043 4.29289 9.29289C4.48043 9.10536 4.73478 9 5 9H25.5L30 14L25.5 19Z"
                        stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M16 4V9" stroke="black" stroke-width="1.5" stroke-linecap="round"
                        stroke-linejoin="round" />
                    <path d="M16 19V28" stroke="black" stroke-width="1.5" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
            </div>
            <section class="field-card__content">
                <h2 class="field-card__label">Dirección</h2>
                <p class="field-card__description">{{ user?.address }}</p>
            </section>
        </article>
        <article class="field-card">
            <div class="field-card__icon" aria-hidden="true">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M24 27V5C24 3.89543 23.1046 3 22 3L10 3C8.89543 3 8 3.89543 8 5L8 27C8 28.1046 8.89543 29 10 29H22C23.1046 29 24 28.1046 24 27Z"
                        stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path
                        d="M16 9C16.8284 9 17.5 8.32843 17.5 7.5C17.5 6.67157 16.8284 6 16 6C15.1716 6 14.5 6.67157 14.5 7.5C14.5 8.32843 15.1716 9 16 9Z"
                        fill="black" />
                </svg>
            </div>
            <section class="field-card__content">
                <h2 class="field-card__label">Teléfono</h2>
                <p class="field-card__description">{{ user?.phone }}</p>
            </section>
        </article>
        <article class="field-card">
            <div class="field-card__icon" aria-hidden="true">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M5.33335 5.33325H26.6667C28.1334 5.33325 29.3334 6.53325 29.3334 7.99992V23.9999C29.3334 25.4666 28.1334 26.6666 26.6667 26.6666H5.33335C3.86669 26.6666 2.66669 25.4666 2.66669 23.9999V7.99992C2.66669 6.53325 3.86669 5.33325 5.33335 5.33325Z"
                        stroke="#424242" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M29.3334 8L16 17.3333L2.66669 8" stroke="#424242" stroke-width="1.5" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
            </div>
            <section class="field-card__content">
                <h2 class="field-card__label">Correo</h2>
                <p class="field-card__description">{{ user?.email }}</p>
            </section>
        </article>
        <article class="field-card">
            <div class="field-card__icon" aria-hidden="true">
                123
            </div>
            <section class="field-card__content">
                <h2 class="field-card__label">Cantidad de rutas</h2>
                <p class="field-card__description">{{ user?.routes?.length }}</p>
            </section>
        </article>
    </div>
</template>

<script lang="ts" setup>
// imports
import { UserInterface } from '@/types/auth.types';

// props
defineProps({
    user: {
        type: Object as () => UserInterface,
        default: () => {
            return {};
        }
    }
});
</script>
