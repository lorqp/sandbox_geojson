//Crear un objeto mapa desde la clase L que es leaflet

//L representa a la biblioteca leaflet 
//El punto (.) se demonina operador de acceso
//Por ejemplo L.map() permite llamar a la función map() para crear mapas

var map = L.map('map');

//Objeto: Un ejemplar de una clase que tiene atributos y comportamiento definido

//Definir los valores iniciales para el objeto map
//.setView(arreglo con la lat, longitud del centro del mapa, entero que indica el zoom)
var map = L.map('map').setView([4.628230660701589, -74.06593125660814], 15);

//Crear un objeto capa de teselas (mapa base)

//L.tileLayer(url de donde voy a "extraer" el mapa, un JSON con los valores de config)

var urlMap= 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'

var config= {
    maxZoom: 19
};

var layer= L.tileLayer(urlMap, config);

//Agregar la capa del mapa
layer.addTo(map);

//Cargar un archivo Geojson

// 1. Abrir el archivo. En js hay que tener cuidado con procesos que sean demorados
//porque js no es un síncrono. Es decir, si una sentencia se demora, js continúa con las otras.

// 2. Convertir el contenido de ese archivo a formato json

async function leerGeoJSON(url) {
    //fetch(): Almacenar un recurso 8obtener un recurso)
    const response = await fetch(url);
    return await response.json();
}

var myFile = leerGeoJSON('map.geojson');

// 3. Agregar el geojson al mapa

// Cargar el GeoJSON directamente con Leaflet
function leerGeoJSON(url) {
    return fetch(url)
        .then(response => response.json());
}

// Uso de la función
leerGeoJSON('map.geojson')
    .then(myFile => {
        const geoLayer = L.geoJSON(myFile, {
            style: function(feature) {
                return {
                    color: '#3388ff',
                    weight: 2,
                    opacity: 0.8,
                    fillOpacity: 0.4
                };
            }
        }).addTo(map);
    })
    .catch(error => console.error('Error:', error));