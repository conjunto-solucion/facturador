import operation, {documentClassCode} from "../models/operation";
import documentProp from "../models/documentProp";
import operationFilters from "../utilities/constants/operationFilters";
import {IDTrader} from "utilities/constants";
import { toFormattedCUIT } from "utilities/conversions";

/**Convierte a el objeto de operación en un string JSON usado por el back-end para generar un documento.
 * @param operation     - El objeto de operación del cual se tomarán los datos.
 * @param documentClassCode - El string de dos caracteres que indica el documento al cual corresponde la operación.
 * @param toSend        - Indica si el documento está siendo enviado por el usuario (a un tercero) o por un tercero (al usuario).
 */
export default function operationToJson(operation: operation, documentClassCode: documentClassCode, toSend: boolean): string {

    function currentOperationIncludes(thisProperty: documentProp): boolean { 
        return operationFilters[thisProperty].includes(documentClassCode); 
    }

    const filteredOperation: any = {
        IDTrader: IDTrader,
        IDPointOfSale: operation.IDPointOfSale
    };


    //Datos del receptor como tercero.
    if (toSend) {
        if (currentOperationIncludes("receiverCUIT"))
        filteredOperation["receiverCode"] =         toFormattedCUIT(operation.thirdParty.CUIT);

        if (currentOperationIncludes("receiverName"))
        filteredOperation["receiverName"] =         operation.thirdParty.name;

        if (currentOperationIncludes("receiverAddress"))
        filteredOperation["receiverAddress"] =      operation.thirdParty.address;

        if (currentOperationIncludes("receiverVATCategory"))
        filteredOperation["receiverVatCategory"] =  operation.thirdParty.VATCategory;

        if (currentOperationIncludes("receiverPostalCode"))
        filteredOperation["receiverPostalCode"] =   operation.thirdParty.postalCode;

        if (currentOperationIncludes("receiverCity"))
        filteredOperation["receiverCity"] =     operation.thirdParty.city;
    }


    //Datos del receptor emisor como tercero.
    else {
        if (currentOperationIncludes("senderCUIT"))
        filteredOperation["senderCode"] =           toFormattedCUIT(operation.thirdParty.CUIT);

        if (currentOperationIncludes("senderName"))
        filteredOperation["senderName"] =           operation.thirdParty.name;

        if (currentOperationIncludes("senderAddress"))
        filteredOperation["senderAddress"] =        operation.thirdParty.address;

        if (currentOperationIncludes("senderVATCategory"))
        filteredOperation["senderVatCategory"] =    operation.thirdParty.VATCategory;

        if (currentOperationIncludes("senderContact"))
        filteredOperation["senderContact"] =        operation.thirdParty.contact;

        if (currentOperationIncludes("startOfActivities"))
        filteredOperation["startOfActivities"] =    operation.thirdParty.startOfActivities; 
    }

    


    //Datos de la operación.

    if (currentOperationIncludes("productTable"))
    filteredOperation["products"] = operation.productTable.description.map((_, i) => {
        return {
            quantity: operation.productTable.quantity[i],
            price:    operation.productTable.price[i],
            detail:   operation.productTable.description[i],
        }
    });

    if (currentOperationIncludes("observations"))
    filteredOperation["observations"] =        operation.observations;

    if (currentOperationIncludes("seller"))
    filteredOperation["seller"] =        operation.seller;

    if (currentOperationIncludes("sellConditions"))
    filteredOperation["sellConditions"] =        operation.sellConditions;

    if (currentOperationIncludes("deadline"))
    filteredOperation["deadline"] =        operation.deadline;

    if (currentOperationIncludes("shippingAddress"))
    filteredOperation["shippingAddress"] =        operation.shippingAddress;

    if (currentOperationIncludes("carrier"))
    filteredOperation["carrier"] =        operation.carrier;

    if (currentOperationIncludes("remittance"))
    filteredOperation["remittance"] =        operation.remittance;

    if (currentOperationIncludes("vat"))
    filteredOperation["vat"] =        operation.VAT

    if (currentOperationIncludes("paymentMethods")) {
        filteredOperation["paymentMethods"] =        operation.receiptXTables.paymentMethods;
        filteredOperation["paymentImputation"] =        operation.receiptXTables.paymentImputation;
        filteredOperation["detailOfValues"] =        operation.receiptXTables.detailOfValues;
        filteredOperation["paymentAddress"] =        operation.paymentAddress;
        filteredOperation["paymentTime"] =        operation.paymentTime;
    }
    
    if (currentOperationIncludes("description"))
    filteredOperation["description"] =        operation.description;

    if (currentOperationIncludes("amount"))
    filteredOperation["amount"] =        operation.amount;

    if (currentOperationIncludes("noProtest"))
    filteredOperation["noProtest"] =        operation.noProtest;

    if (currentOperationIncludes("timeDelay")) {
        filteredOperation["timeDelay"] =        operation.timeDelay;
        filteredOperation["crossed"] =        operation.crossed;
    }


    return JSON.stringify(filteredOperation);
}