import ajax from 'ports/ajax';
import getToken from 'services/getToken';
import { base64ToBlob } from 'utilities/conversions';


/**
* Recupera un File correspondiente al avatar de usuario del propietario del token de acceso almacenado.
* @param callback La función que procesará la respuesta. 
*/
export default function getUserAvatar(callback: Function): void {

    if (localStorage.getItem("avatar")) 
        returnAsFile(200, localStorage.getItem("avatar"));
    else 
        ajax("GET","users/"+sessionStorage.getItem('username'),{token: getToken('access')}, returnAsFile);

    async function returnAsFile(status:number, base64:string):Promise<void> {
        if (status !== 200 || base64 === 'undefined')
        return callback(false);
    
        callback(true, await base64ToBlob(base64));
            
        //Almacenar el avatar en localStorage si no está almacenado.
        if (!localStorage.getItem("avatar"))
        localStorage.setItem("avatar", base64);
    }
}
