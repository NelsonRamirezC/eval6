import fs from 'fs';

export const leerMascotas = () => {
    let data = fs.readFileSync("mascotas.json", "utf8");
    return JSON.parse(data);
}

export const leerMascotasPorId = (id) => {
    let data = fs.readFileSync("mascotas.json", "utf8");
    let mascotas = JSON.parse(data);
    let mascotasFiltradas = mascotas.mascotas.find(mascota => mascota.id == id);
    return mascotasFiltradas;
}

export const guardarMascota = (mascota) => {
    let data = leerMascotas();
    data.mascotas.push(mascota);
    fs.writeFileSync("mascotas.json", JSON.stringify(data, null, 4), 'utf8');
}

export const eliminarMascota = (nombre) => {
    let data = leerMascotas();
    let found = data.mascotas.find(mascota => mascota.nombre == nombre);
    if(found){
        let filterMascotas = data.mascotas.filter(mascota => mascota.nombre != nombre);
        data.mascotas = filterMascotas;
        fs.writeFileSync("mascotas.json", JSON.stringify(data, null, 4), 'utf8');
        return true;
    }else{
        return false;
    }
}

export const eliminarMascotaPorRun = (run) => {
    let data = leerMascotas();

    let found = data.mascotas.find(mascota => mascota.propietario.run == run);
    if(found){
        let filterMascotas = data.mascotas.filter(mascota => mascota.propietario.run != run);
        data.mascotas = filterMascotas;
        fs.writeFileSync("mascotas.json", JSON.stringify(data, null, 4), 'utf8');
        return true;
    }else{
        return false;
    }
}