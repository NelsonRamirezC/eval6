import express from 'express';
import { v4 as uuid } from 'uuid';
import {leerMascotas, guardarMascota, eliminarMascota, eliminarMascotaPorRun, leerMascotasPorId } from './utils.js'
import cors from 'cors';
import { create } from 'express-handlebars'

import * as path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(cors());

app.listen(3000, () => console.log("servidor en http://localhost:3000"))

//CONFIGURACIÓN HANDLEBARS
const hbs = create({
	partialsDir: [
		"views/partials/",
	],
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"));

app.get("/mascotas", (req, res) => {
    try {
        let mascotas = leerMascotas();
        res.json({code: 200, data: mascotas});
    } catch (error) {
        res.status(500).json({code: 500, message:"Ha ocurrido un error al buscar las mascotas."})
    }
})

app.get("/mascotas/:nombre", (req, res) => {
    try {
        let {nombre} = req.params;
        let data = leerMascotas();
        let filterMascotas = data.mascotas.filter(mascota => mascota.nombre == nombre)
        res.json({code: 200, data: filterMascotas});
    } catch (error) {
        res.status(500).json({code: 500, message:"Ha ocurrido un error al buscar las mascotas."})
    }
})

app.get("/mascotas/propietario/:run", (req, res) => {
    try {
        let {run} = req.params;
        let data = leerMascotas();
        let filterMascotas = data.mascotas.filter(mascota => mascota.propietario.run == run)
        res.json({code: 200, data: filterMascotas});
    } catch (error) {
        res.status(500).json({code: 500, message:"Ha ocurrido un error al buscar las mascotas."})
    }
})

app.post("/mascotas", (req, res) => {
    try {
        let { mascota, run, propietario } = req.body;
        if(!mascota || !run || !propietario){
           return res.status(400).json({code: 400, message:"Debe enviar todos los datos requeridos [nombre mascota, run, nombre propietario]"})
        }
        let nuevaMascota = {
        id: uuid().slice(0,6),
        nombre: mascota,
        propietario: {
                run,
                nombre:propietario
            }
        }
        guardarMascota(nuevaMascota);
        res.json({code: 201, message: `Mascota ${mascota} creada correctamente`})
            
    } catch (error) {
        res.status(500).json({code: 500, message:"Ha ocurrido un error al guardar la mascota."})
    }
})


app.delete("/mascotas/:nombre", (req, res) => {

    try{
        let { nombre } = req.params;
        if(eliminarMascota(nombre)){
           res.json({code: 200, message:`Mascota ${nombre} eliminada correctamete`}) 
        }else{
            res.status(400).json({code: 400, message:`Mascota  con nombre ${nombre} no existe en el sistema.`})
        }
        
    }catch(error){
        res.status(500).json({code: 500, message:"Ha ocurrido un error al eliminar las mascotas."})
    }
    
})

app.delete("/mascotas/propietario/:run", (req, res) => {

    try{
        let { run } = req.params;
        if(eliminarMascotaPorRun(run)){
           res.json({code: 200, message:`Mascota/s del propietario con RUN ${run} eliminadas correctamete`}) 
        }else{
            res.status(400).json({code: 400, message:`propietario no existe en el sistema.`})
        }
        
    }catch(error){
        res.status(500).json({code: 500, message:"Ha ocurrido un error al eliminar las mascotas."})
    }
    
})


//RUTAS DE LAS VISTAS

app.get("/", (req, res) => {
    let mascotas = leerMascotas();
    res.render("home", {
        mascotas: mascotas.mascotas
    })
})

app.get("/detalle_mascota/:id", (req, res) => {
    let { id } = req.params;
    if(!id) return res.send("Debe enviar los datos solicitados.")
    let mascota = leerMascotasPorId(id)
    res.render("detalle_mascota", {
        mascota
    })
})

app.get("/formulario", (req, res) => {
    res.render("nueva_mascota")
})