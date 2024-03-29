//React.
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//Componentes del formulario.
import { BackArrow, Loading } from "components/standalone";
import { Button, DateTime, Field, Form, Message, Radio, Select, Switch, Table, Textarea } from "components/formComponents";
import { Cond, FlexDiv, Retractable, Section } from 'components/wrappers';
import { BiChevronsDown } from "react-icons/bi";
import PlusIcon from "./components/PlusIcon";
import Filter from "./components/Filter";

//Utilidades.
import getOperationFormTitle from './utilities/getOperationFormTitle';
import isValidOperation from './utilities/isValidOperation';
import Valid from "utilities/Valid";
//Servicios.
import postOperation from './services/postOperation';
import getListOfBranchesAndPoints from './services/getListOfBranchesAndPoints';
//Tipos.
import operation, {documentClassCode} from './models/operation';
import documentIdentifier from "./models/documentIdentifier";


type props = { documentClassCode: documentClassCode };

/**
 * Devuelve un formulario que recolecta los datos necesitados por el back-end para generar un documento comercial.
 * @param props.type Código del documento de dos caracteres.
 */
export default function OperationForm({ documentClassCode }: props): JSX.Element {

  //Datos para mostrar el documento comercial generado existosamente.
  const [IDOperation, setIDOperation] = useState();
  const navigate  = useNavigate();
  function seeDocument() {
    navigate(`/inicio/operacion/documento?id=${IDOperation}&class=${documentClassCode}`)
  }



  //Comunicación con el servidor.
  useEffect(()=>{ getListOfBranchesAndPoints().then( response => {
    if (!response.ok) return;
    setBranchesAndPoints(response.content)
  })}, []);


  async function generateOperation(): Promise<void> {
    setError("");

    if (!isValidOperation(operation, documentClassCode, setError)) return;

    setLoading(true);
    const response = await postOperation(operation);
    if (!response.ok) return setError(response.message);

    setIDOperation(response.content);
    setLoading(false);
  }
 

  //Datos de control del formulario.
  const [error,               setError] =               useState("");
  const [loading,             setLoading] =             useState(false);
  const [branchesAndPoints,   setBranchesAndPoints] =   useState();


  //Datos de la operación.
  const [operation, setOperation]: [operation, React.Dispatch<React.SetStateAction<operation>>] =
  useState({
    documentClassCode: documentClassCode,
    IDBranch: -1,
    IDPointOfSale: undefined,
    thirdParty: {
      CUIT:             '',
      name:             '',
      address:          '',
      contact:          '',
      VATCategory:      "Responsable Inscripto",
      postalCode:       '',
      city:         ''
    },
    productTable: {
      quantity:         [0],
      description:      [''],
      price:            [0]
    },
    observations:       '',
    seller:             '',
    sellConditions:     "Cuenta corriente",
    deadline:           '',
    shippingAddress:     '',
    carrier:            '',
    remittance:       '',
    VAT:                21,
    receiptXTables: {
      paymentMethods: {
        check:          '0',
        documents:      '0',
        cash:           '0'
      },
      paymentImputation: {
        type:           [""],
        documentNumber: ['0'],
        amount:         ['0'],
        paid:           ['0']
      },
      detailOfValues: {
        type:           [''],
        bank:           [''],
        documentNumber: [''],
        depositDate:    [''],
        amount:         ['0']
      }
    },
    paymentAddress:    '',
    paymentTime:        '',
    description:        '',
    amount:             0,
    noProtest:          false,
    timeDelay:          0,
    crossed:            false
    
  });


  function setThirdParty(thirdParty: typeof operation.thirdParty) { setOperation({...operation, thirdParty: thirdParty}) }

  function setProductTable(table: string[][]) {
    const operationTemp = {...operation}
    operationTemp.productTable.quantity =     table[0].map(quantity=>parseInt(quantity));
    operationTemp.productTable.description =  table[1];
    operationTemp.productTable.price =        table[2].map(quantity=>parseInt(quantity));
    setOperation(operationTemp);
  }
  
  
  return (

    <Form title={getOperationFormTitle(documentClassCode, true)} onSubmit={generateOperation}>

      <BackArrow />
      <Message type="error" message={error} />

      <Section label="Partícipes">

        <FlexDiv>
          <Select 
          options={branchesAndPoints}
          value={operation.IDBranch}
          onChange={(ID: number) => setOperation({...operation, IDBranch: ID})} 
          subValue={operation.IDPointOfSale} 
          subOnChange={(ID: number) => setOperation({...operation, IDPointOfSale: ID})} 
          fallback="Crea una sucursal:"
          label="Elige una sucursal" sublabel="Elige un punto de venta" />
          <PlusIcon title="nueva sucursal" link={"/inicio/sucursales/nuevo"} />
        </FlexDiv>
 
        <BiChevronsDown style={{ margin: "0 auto", display: "block", cursor: "default", fontSize: "2rem", color: "#333" }} />

      </Section>



      <Cond bool={"Tk"!==documentClassCode}>
      <Retractable label="Datos del tercero" initial={false}>

        <FlexDiv>

        <Filter by="receiverName" classCode={documentClassCode}>
          <Field label="Nombre"
          bind={[operation.thirdParty.name, (name: string) => 
          setThirdParty({...operation.thirdParty, name: name})]} 
          validator={Valid.names(operation.thirdParty.name)} />
        </Filter>

        <Filter by="receiverCUIT" classCode={documentClassCode}>
          <Field label={operation.thirdParty.VATCategory === "Consumidor Final" ? "C.U.I.L." : "C.U.I.T."} bind={[operation.thirdParty.CUIT, (CUIT: string) => 
          setThirdParty({...operation.thirdParty, CUIT: CUIT})]} 
          validator={Valid.CUIT(operation.thirdParty.CUIT)} />
        </Filter>

        </FlexDiv>


        <FlexDiv>

        <Filter by="receiverAddress" classCode={documentClassCode}>
          <Field label="Domicilio" note="(calle y altura)" bind={[operation.thirdParty.address, (address: string) => 
          setThirdParty({...operation.thirdParty, address: address})]} validator={Valid.address(operation.thirdParty.address)} />
        </Filter>

        <Filter by="receiverCity" classCode={documentClassCode}>
          <Field label="Localidad" bind={[operation.thirdParty.city, (city: string) => 
          setThirdParty({...operation.thirdParty, city: city})]} validator={Valid.address(operation.thirdParty.city)} />
        </Filter>

        <Filter by="receiverPostalCode" classCode={documentClassCode}>
        <Field label="Código postal" type="number" bind={[operation.thirdParty.postalCode, (postalCode: string) => 
          setThirdParty({...operation.thirdParty, postalCode: postalCode})]} validator={Valid.postalCode(operation.thirdParty.postalCode)} />
        </Filter>

        </FlexDiv>

        <Filter by="receiverVATCategory" classCode={documentClassCode}>
          <Radio legend="Categoría" options={["Responsable Monotributista", "Responsable Inscripto", "Consumidor Final", "Sujeto Exento"]} 
          bind={[operation.thirdParty.VATCategory, (VATCategory: string) => 
          setThirdParty({...operation.thirdParty, VATCategory: VATCategory})]} />
        </Filter>

      </Retractable>
      </Cond>

      
      <Retractable label="Datos de la operación">

        <Filter by="productTable" classCode={documentClassCode}>
          <Table
            thead={[{ name: "Cantidad", type: "number" }, { name: "Descripción" }, { name: "Precio", type: "number" }]}
            tbody={[operation.productTable.quantity, operation.productTable.description, operation.productTable.price]} 
            onChange={(newTable: string[][])=>setProductTable(newTable)} maxRows={10} />
        </Filter>

        <Filter by="vat" classCode={documentClassCode}>
          <Radio legend="IVA" options={[21, 10, 4, 0]} bind={[operation.VAT, (VAT: string)=>setOperation({...operation, VAT: parseInt(VAT)})]} />
        </Filter>
        
      </Retractable>



      <Cond bool={"OcRmFaNdNcRx".includes(documentClassCode)}><Retractable label="Datos opcionales">

        <Filter by="sellConditions" classCode={documentClassCode}>
          <Radio legend="Condiciones de venta" options={["Al contado", "Cuenta corriente", "Cheque", "Pagaré", "Otro"]}
          bind={[operation.sellConditions, (sellConditions: string)=>setOperation({...operation, sellConditions: sellConditions})]} />
        </Filter>

        <Filter by="remittance" classCode={documentClassCode}>
          <Field label="Remito N°" bind={[operation.remittance, (remittance: string)=>setOperation({...operation, remittance: remittance})]}/>
        </Filter>

      </Retractable></Cond>

      

      <Message type="error" message={error} />


      <Cond bool={IDOperation !== undefined}>
        <Message type="success" message="Se ha creado el documento comercial" />
        
        <FlexDiv justify="flex-end">
          <Button type="delete" onClick={()=>seeDocument()}>Ver PDF</Button>
        </FlexDiv>
      </Cond>

      <Cond bool={IDOperation === undefined}>
        <FlexDiv justify="flex-end"><Button type="submit">Generar</Button></FlexDiv>
      </Cond>

      <Cond bool={loading}><Loading /></Cond>
      
    </Form>
  );
}


/*
BACKUP:


<Cond bool={!"RsCh".includes(type)}>
  <Field label="Teléfono" type="tel" bind={[phone, setPhone]} validator={Valid.phone(phone)} />
</Cond>

<FlexDiv>
  <Field label="Email" type="email" bind={[email, setEmail]} validator={Valid.email(email)} />
  <Cond bool={toSend}>
    
  </Cond>
</FlexDiv>


<FlexDiv>

        <Cond bool={"RsPa".includes(type)}>
          <DateTime label="Fecha límite" value={deadline} onChange={setDeadline} />
        </Cond>

        <Cond bool={"Pa"===type}>
          <Switch label="Sin protesto" value={noProtest} setter={setNoProtest} />
        </Cond>

        </FlexDiv>

        

        <Cond bool={"Rx"===type}>
          <Table label="Forma de pago"
            thead={[{ name: "Cheque", type: "number" }, { name: "Documentos", type: "number" }, { name: "Efectivo", type: "number" }]}
            tbody={RxAmounts} onChange={setRxAmounts} maxRows={1} />

          <Table label="Imputación del pago"
            thead={[{ name: "Tipo" }, { name: "Número", type: "number" }, { name: "Importe", type: "number" }, { name: "Abonado", type: "number" }]}
            tbody={RxInvoices} onChange={setRxInvoices} maxRows={3} />

          <Table label="Detalle de valores"
            thead={[{ name: "Tipo" }, { name: "Banco" }, { name: "Número" }, { name: "Fecha de depósito", type: "date" }, { name: "Importe", type: "number" }]}
            tbody={RxDetails} onChange={setRxDetails} maxRows={3} />
        </Cond>


        <FlexDiv>
        <Cond bool={"RsPa".includes(type)}>
          <Field label="Descripción" bind={[description, setDescription]} />
        </Cond>

        <Cond bool={"RsPaCh".includes(type)}>
          <Field type="number" label="Cantidad" bind={[amount, setAmount]} />
        </Cond>
        </FlexDiv>


        <Cond bool={"Ch"===type}>
          <Field label="Diferencia de tiempo en días" type="number" bind={[timeDelay, setTimeDelay]} />
          <Switch label="Cruzado" value={crossed} setter={setCrossed} />
        </Cond>


        <Cond bool={"OcRm".includes(type)}>
          <Textarea label="Observaciones" bind={[observations, setObservations]} />
        </Cond>

        <Cond bool={"Oc".includes(type)}>
          <Field label="Vendedor de preferencia" bind={[seller, setSeller]} />
        </Cond>


        <Cond bool={"Oc"===type}>
          <FlexDiv>
            <DateTime label="Fecha límite" nonPast value={deadline} onChange={setDeadline} />
            <Field label="Lugar de entrega" bind={[placeOfDelivery, setPlaceOfDelivery]} />
            <Field label="Transportista" bind={[carrier, setCarrier]} />
          </FlexDiv>
        </Cond>

        <Cond bool={"Rx"===type}>
          <FlexDiv>
            <Field label="Domicilio de pago" bind={[paymentAddress, setPaymentAddress]} />
            <DateTime label="Horario de pago" type="time" value={paymentTime} onChange={setPaymentTime} />
          </FlexDiv>
        </Cond>

*/
