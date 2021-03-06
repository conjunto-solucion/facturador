import ajax from 'interceptors/ajax';
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
        ajax("GET","useravatars",{token: getToken('access')}, returnAsFile);

    async function returnAsFile(state:number, base64:string):Promise<void> {
        if (state !== 200) {callback(false); return;}
        if (base64 === 'undefined') {callback(false); return;}
    
        const blob = await base64ToBlob(base64.slice(22)); //"data:image/png;base64,".length === 22
        callback(true, blob);
            
        //Almacenar en localstorage si no está almacenado.
        if (!localStorage.getItem("avatar")) localStorage.setItem("avatar", base64);
        return;
    }
}
