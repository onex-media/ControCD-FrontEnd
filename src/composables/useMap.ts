import * as L from "leaflet";
import { ref, onMounted } from "vue";
import { map } from "leaflet";

export function useMap() {
    const map = ref<any>(null);
    const marker = ref<any>(null);
    const locationSelected = ref<any>(null);

    const runMap =  (mapId: string, lat: number, lng: number, zoom: number) => {
        map.value =  L.map(mapId).setView([lat, lng], zoom);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map.value);
        map.value.on("click", selectLocation);
    };

    const selectLocation = (e: any) => {
        if (marker.value) {
            map.value.removeLayer(marker.value);
        }
        marker.value = L.marker(e.latlng).addTo(map.value);
        marker.value
            .bindPopup(`Ubicacion asignada en ${e.latlng.lat.toFixed(2)}, ${e.latlng.lng.toFixed(2)}`)
            .openPopup();
        locationSelected.value = e.latlng;
    };

    const setMarker = async (lat: number, lng: number) => {

        if (marker.value) {
            map.value.removeLayer(marker.value);
        }
        console.log('marker.value2222: ', marker.value);
        marker.value =  await L.marker([lat, lng]).addTo(map.value);
        marker.value
            .bindPopup(`Ubicacion asignada en ${lat.toFixed(2)}, ${lng.toFixed(2)}`)
            .openPopup();
    };

    const isMapReady = () => {
        return map.value !== null;
    };

    const getSelectedLocation = () => {
        return locationSelected.value;
    };

    return {
        map,
        marker,
        locationSelected,
        runMap,
        setMarker,
        isMapReady,
        getSelectedLocation,
    };
}
