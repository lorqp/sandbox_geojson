//crear un objeto mapa desde la clase L que es leaflet
//L representa a la biblioteca Leaflet
//El punto (.) se denomina operador de acceso
//Por ejemplo L.map() permite llamar a la funcion map() para crear mapas

var map = L.map('map');

//objeto es un ejemplar de una clase que tiene atributos y comportamientos definido
//definir los valores iniciales para el objeto map
//.setView(Arreglo con la lat - longitud del centro del mapa, entero que indica el zoom)

map.setView([4.628000794098537, -74.06590986877465], 15);

//Crear un objeto capa de teselas (mapa base)
//L.tileLayer(url de donde voy a extraer el mapa, un JSON con los valores de configuracion)

var urlMap = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
var config = {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
};

var layer = L.tileLayer(urlMap, config);

//agregar la capa al mapa
layer.addTo(map);

//cargar un archivo Geojson
// 1. Abrir el archivo en js hay que tener cuidado con procesos que sean demorados porque un js no es sincrono, 
// es decir, si una sentencia se demora, js continua con las otras. 

//2. convertir el contenido de ese archivo a formato json
async function leerGeoJSON(url) {
    //fetch(): Almacenar un recurso (obtener un recurso)
    var response = await fetch(url);
    if (!response.ok) {
        throw new Error('Error al cargar el archivo: ' + response.status);
    }
    return await response.json();
}

//3. agregar el geojson al mapa usando la versión alternativa simple
leerGeoJSON("map.geojson")
    .then(function(myFile) {
        // Crear y agregar la capa GeoJSON al mapa
        const geoLayer = L.geoJSON(myFile, {
            style: function(feature) {
                return {
                    color: '#3388ff',
                    weight: 2,
                    opacity: 0.8,
                    fillColor: '#3388ff',
                    fillOpacity: 0.4
                };
            },
            onEachFeature: function(feature, layer) {
                // Agregar popup con información si hay propiedades
                if (feature.properties) {
                    var popupContent = '<div style="max-width: 300px;">';
                    for (var key in feature.properties) {
                        if (feature.properties.hasOwnProperty(key)) {
                            popupContent += '<strong>' + key + ':</strong> ' + feature.properties[key] + '<br>';
                        }
                    }
                    popupContent += '</div>';
                    layer.bindPopup(popupContent);
                }
            }
        });
        
        geoLayer.addTo(map);
        
        // Ajustar la vista del mapa para mostrar todo el GeoJSON
        map.fitBounds(geoLayer.getBounds(), {
            padding: [50, 50],
            maxZoom: 18
        });
        
        console.log('GeoJSON cargado exitosamente con ' + Object.keys(myFile.features).length + ' features');
    })
    .catch(function(error) {
        console.error('Error al cargar el GeoJSON:', error);
        alert('Error: ' + error.message);
    });

// Función opcional para agregar controles al mapa
function agregarControles() {
    // Agregar control de escala
    L.control.scale({metric: true, imperial: false}).addTo(map);
    
    // Agregar control de capas (aunque solo tenemos una capa base por ahora)
    var baseMaps = {
        "OpenStreetMap": layer
    };
    
    L.control.layers(baseMaps).addTo(map);
}

// Llamar a la función para agregar controles
agregarControles();