import ajax from 'interceptors/ajax';
import getToken from '../../../services/getToken';
/**Solicita que un código de eliminación de cuenta sea enviado por email al propietario de la cuenta.*/
export default function requestDeletionCode(callback) {
    ajax("HEAD", "mainaccounts", { token: getToken("access") }, respond);
    function respond(state, data) {
        if (state === 200)
            callback(true);
        else
            callback(false, data);
    }
}
