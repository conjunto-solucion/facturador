import fetch from 'api/fetch';

export type group = {
  
};

export default class Group {
    /**
     * Recupera un array de grupos a nombre de la cuenta solicitante.
     * Un id puede ser proporcionado en el URL para filtrar la respuesta.
     * @param callback La función que procesará la respuesta. 
     */
    public static retrieve(callback: Function): void {
        callback(200, JSON.stringify(
            [
                {
                    id: 1,
                    value: "group A",
                    tooltip: "4 integrantes"
                },
                {
                    id: 2,
                    value: "socio B",
                    tooltip: "20 integrantes"
                },
                {
                    id: 3,
                    value: "socio C",
                    tooltip: "2 integrantes"
                }
            ]

        ))
    }
}