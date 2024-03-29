//React.
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//Servicios.
import deleteAccount from './services/deleteAccount';
import getLocalUserAvatar from './services/getLocalUserAvatar';
import getTraderData from './services/getTraderData';
import putAccount from './services/putAccount';
//Validación.
import Valid from "utilities/Valid";
//GUI.
import { Button, Field, Form, Image, Message, Radio } from "components/formComponents";
import { Loading } from "components/standalone";
import { Confirm, FlexDiv, Retractable, Section } from "components/wrappers";
import { BiChevronLeft } from "react-icons/bi";
//Modelos.
import editedAccount from "./models/editedAccount";
import traderData from "./models/traderData";


/**Un formulario que permite cambiar datos de la cuenta / eliminar la cuenta de usuario y el comerciante. */
export default function Account(): JSX.Element {

    /*DATOS***************************************************************/

    const navigate =                useNavigate(); 
    const [loading, setLoading] =   useState(false);
    const [success, setSuccess] =   useState(false);
    const [deleteSuccess, setDeleteSuccess] =   useState(false); 
    

    //Errores.
    const [error, setError] =                       useState("");
    const [deleteError, setDeleteError] =           useState("");
    //Datos del usuario.
    const [avatar, setAvatar] =                     useState(undefined);
    const [newUsername, setNewUsername] =           useState('');
    const [password, setPassword] =                 useState("");
    const [newPassword, setNewPassword] =           useState("");
    const [confirmPassword, setConfirmPassword] =   useState("");
    //Datos del comerciante.
    const [businessName, setBusinessName] =         useState("");
    const [newBusinessName, setNewBusinessName] =   useState("");
    const [VATCategory, setVatCategory] =           useState("");
    const [newVATCategory, setNewVATCategory] =     useState("");
    const [CUIT, setCUIT] =                         useState("");

    //Pedir los datos actuales en el primer renderizado.
    useEffect(getAvatarAndTraderData);
    
    function getAvatarAndTraderData() {
        getLocalUserAvatar().then(response => {
            if (response.ok && !avatar) setAvatar(response.content);
        });

        getTraderData().then(response=> {
            if (!response.ok) return setError(response.message)
            
            const traderData: traderData = response.content;
            setBusinessName (traderData.businessName);
            setVatCategory  (traderData.VATCategory);
            setCUIT         (traderData.CUIT);
        });

    }

    /*VALIDACIÓN***************************************************************/

    function submitIfEditedAccountIsValid():void {
        if (!Valid.image(avatar, setError)) return;
        if (newUsername && !Valid.names(newUsername, setError)) return;
        if (Valid.password(password)) {
            if (!Valid.password(newPassword, setError)) return;
            if (newPassword!==confirmPassword) return setError("Las contraseñas no coinciden");
        }
        if (newBusinessName && !Valid.names(newBusinessName)) return setError("La razón social debe ser de entre 3 y 20 caracteres");
        if (newVATCategory && !Valid.vatCategory(newVATCategory, setError)) return;
        submit();
    }

    /*COMUNICACIÓN***************************************************************/

    //Envía los datos al servidor.
    async function submit() {
        setLoading(true);
        const account: editedAccount = {
            user: {
                updatedUsername:  newUsername,
                password:         password,
                updatedPassword:  newPassword,
                updatedAvatar:    avatar,
            },
            trader: {
                updatedBusinessName: newBusinessName,
                updatedVATCategory:  newVATCategory,
            }
        } 
        const response = await putAccount(account);
        
        if (!response.ok) return setError(response.message);
        setSuccess(true);
        if (newUsername) sessionStorage.setItem("username", newUsername);
    }

    //Elimina la cuenta de usuario.
    async function requestAccountDeletion() {
        const response = await deleteAccount();
        if (!response.ok) setDeleteError(response.message);
        else setDeleteSuccess(true);
    }


    /*FORMULARIO***************************************************************/

    return (
        <>
   
        <Form title="Opciones de la cuenta" onSubmit={submitIfEditedAccountIsValid}>
            <BiChevronLeft onClick={() => navigate("/inicio")} style={{margin:"1rem", fontSize:"2rem", color:"rgb(44,44,44)",cursor:"pointer"}} />
                
            <Image label='' setter={setAvatar} img={avatar} />

            <Field bind={[newUsername, setNewUsername]} label="Nombre"
            placeholder={sessionStorage.getItem('username')}
            validator={Valid.names(newUsername)} />

            <Field bind={[password, setPassword]} type="password"
            label="Para cambiar tu contraseña, introduce la contraseña actual:"
            validator={Valid.password(password)} />
            {!Valid.password(password) ? null:
            <>
            <Field bind={[newPassword, setNewPassword]} label="Nueva contraseña" type="password"
            validator={Valid.password(newPassword)} />
            <Field bind={[confirmPassword, setConfirmPassword]} 
            label="Confirmar nueva contraseña" type="password"
            validator={confirmPassword === newPassword} />
            </>}

            <Section label="Datos del comercio">
                <p style={{textAlign:"center", cursor:"default"}}>C.U.I.T.: {CUIT}</p>

                <Field bind={[newBusinessName, setNewBusinessName]} label="Razón social"
                placeholder={businessName} validator={Valid.names(newBusinessName)} />
                        
                <Radio legend={"Actualmente: "+VATCategory+". Nueva categoría:"} bind={[newVATCategory, setNewVATCategory]}
                options={["Responsable Inscripto", "Responsable Monotributista"]} />
            </Section>

            <Message type="error" message={error} />

            {success? <Message type="success" message="Se han guardado los cambios"/>:
            loading?<Loading />:
            <Button type="submit">Confirmar cambios</Button>}
            

            <p style={{textAlign:"center", color:"#fff", cursor:"default"}}>...</p>
            <Retractable label="Otras opciones" initial={false}>
                

                <Message type="error" message={deleteError} />

                {deleteSuccess? <Message type="success" message={`Se ha eliminado la cuenta`}/>:
                loading? <Loading /> :
                
                <FlexDiv justify='space-between'>

                    <Confirm label="¿Está seguro de que quiere eliminar su cuenta? Esta acción es irreversible"
                    onConfirm={requestAccountDeletion}>
                        <Button type="delete">Borrar la cuenta</Button>
                    </Confirm>
                </FlexDiv>}
                

            </Retractable>
        </Form>
        </>
    )
}