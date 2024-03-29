import React from "react";
const html2pdf = require("html2pdf.js");

type props = {
    nodeReference: React.MutableRefObject<undefined>,
    filename: string
}

/**Un botón que permite descargar un documento PDF, cuyo contenido es extraido de una referencia a un nodo. */
export default function PDFButton({nodeReference, filename}: props): JSX.Element {

    const documentPreferences = {
        margin: .5,
        filename: filename ?? "documento",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
    }

    function displayPDF(): void {
        html2pdf().set(documentPreferences).from(nodeReference.current).save();
    }

    const PDFButtonStyle = {
        backgroundColor: "#f33",
        width: "minContent",
        border: "none",
        padding: ".4rem 1.4rem",
        borderRadius: "5px",
        color: "#fff",
        fontFamily: "monospace",
        fontSize:"1.2rem",
        borderBottom: "2px solid #b00",
        cursor: "pointer"
    }

    return <button onClick={()=>displayPDF()} style={PDFButtonStyle}>
        descargar PDF
    </button>
}