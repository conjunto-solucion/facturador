import ajax from 'ports/ajax';
import Response from 'models/Response';
import operation from '../models/operation';
import operationToJson from "../adapters/operationToJson";
import documentClassCodeToDocumentName from "../utilities/conversions/documentClassCodeToDocumentName";

/**Envía una operación para crear un documento comercial cualquiera. Devuelve el ID de la operación si fuese exitosa. */
export default async function postOperation(operation: operation): Promise<Response> {

    const subrepository = "FaNdNc".includes(operation.documentClassCode)? "/fulls" : '';
    const URL = `operations${subrepository}/${documentClassCodeToDocumentName(operation.documentClassCode)}`

    const response = await ajax('POST', URL, true, operationToJson(operation, operation.documentClassCode, true))

    return response;

}