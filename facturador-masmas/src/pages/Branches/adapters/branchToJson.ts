import { fileToBase64 } from 'utilities/conversions';
import branch from '../models/branch';

/**Adapta un objeto de sucursal a un formato esperado por el servidor para crear un nueva sucursal. */
export default async function branchToJson(branch: branch): Promise<string> {
    return JSON.stringify({
        IDTrader: sessionStorage.getItem('IDTrader'),
        name:  branch.name,
        email: branch.email,
        phone: branch.phone,
        address: {
            province:      branch.address.province,
            city:          branch.address.city,
            postalCode:    branch.address.postalCode,
            street:        branch.address.street,
            addressNumber: branch.address.addressNumber ?? "S/N",
        },
        photo:  await fileToBase64(branch.photo),
        logo:   await fileToBase64(branch.logo),
        preferenceColor:  branch.preferenceColor,
    })
}