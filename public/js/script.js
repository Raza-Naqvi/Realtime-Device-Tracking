const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        position => {
            const { latitude, longitude } = position.coords;
            socket.emit('send-location', { latitude, longitude });
        },
        err => {
            console.log('watchPosition error', err);
        },
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 10000
        },
    );
};

const map = L.map('map').setView([0, 0], 16);
const markers = {};

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'OpenStreetMap'
}).addTo(map);

socket.on('receive-location', data => {
    const { id, latitude, longitude } = data;
    map.setView([latitude, longitude], 16);
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    };
});

socket.on('user-disconnected', (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    };
});