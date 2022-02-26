/**
 * Implementa una capa de abstracción para la API XMLHR.
 * Permite realizar operaciones get, post, put y delete, enviando los datos
 * a un URL, y pudiendo adjuntar un JWT opcional.
 * @param {("get"|"post"|"put"|"delete")} [method] - El método HTTP a ser utilizado.
 * @param {string} [url]            - Sufijo del url del recurso.
 * @param {string} [content.body]   - Cuerpo opcional de la petición.
 * @param {string} [content.token]  - Token JWT opcional de la petición.
 * @param {Function} [callback]     - Función para manejar la respuesta.
 * Siempre se invoca con dos argumentos: un código de estado de la petición, y el contenido,
 * pudiendo ser un mensaje de error o los datos de respuesta.
 */
export default function fetch(method, url, content, callback) {
    //Definir la request.
    var xhr = new XMLHttpRequest();
    if (!xhr) {
        callback(0, "Las solicitudes XMLHTTP no son soportadas en tu navegador");
        return;
    }
    //Configurar la request.
    url = process.env.BASE_URL + url;
    xhr.onreadystatechange = handleResponse;
    xhr.timeout = 15000;
    xhr.ontimeout = function () { callback(0, "Se ha agotado el tiempo de espera del servidor"); return; };
    //Abrir la request.
    xhr.open("POST", url, true);
    if (content.body !== undefined)
        xhr.setRequestHeader("Content-Type", "application/json");
    if (content.token !== undefined)
        xhr.setRequestHeader("Token", 'Bearer' + content.token);
    xhr.send(content.body);
    //Manejar la respuesta.
    function handleResponse() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 0)
                callback(0, "No se ha podido establecer la comunicación con el servidor");
            else
                callback(xhr.status, xhr.responseText);
            return;
        }
    }
}