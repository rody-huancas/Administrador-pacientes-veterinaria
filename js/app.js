// Inputs de formulario
const mascotaInput = document.querySelector("#mascota");
const propietarioInput = document.querySelector("#propietario");
const telefonoInput = document.querySelector("#telefono");
const fechaInput = document.querySelector("#fecha");
const horaInput = document.querySelector("#hora");
const sintomasInput = document.querySelector("#sintomas");

// Interfaz de usuario
const formulario = document.querySelector("#nueva-cita");
const contenedorCitas = document.querySelector("#citas");

let editando;

// Clases
class Citas {
    constructor() {
        this.citas = [];
    }

    agregarCita(cita) {
        this.citas = [...this.citas, cita];
    }

    eliminarCita(id) {
        this.citas = this.citas.filter(cita => cita.id !== id)
    }

    editarCita(citaAcutalizada) {
        this.citas = this.citas.map(cita => cita.id === citaAcutalizada.id ? citaAcutalizada : cita);
    }
}

class Interfaz {
    imprimirAlerta(mensaje, tipo) {
        const alertaError = document.querySelector(".div-alerta");
        if (!alertaError) {
            const divMensaje = document.createElement("DIV");
            divMensaje.classList.add("div-alerta");
            if (tipo === "error") {
                divMensaje.classList.add("div-alerta-error");
            } else {
                divMensaje.classList.add("div-alerta-success");
            }
            divMensaje.textContent = mensaje;
            // Agregar div al DOM
            document.querySelector("#contenido").insertBefore(divMensaje, document.querySelector(".formulario"));
            // Quitar mensaje de error después de 3s
            setTimeout(() => {
                divMensaje.remove();
            }, 3000);
        }
    }

    imprimirCita({ citas }) {
        this.limpiarHtml();

        citas.forEach(cita => {
            const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

            const divCita = document.createElement("DIV");
            divCita.classList.add("pacientes__lista");
            divCita.dataset.id = id;

            // scripting de los elementos de la cita
            const mascotaParrafo = document.createElement("H2");
            mascotaParrafo.classList.add("titulo-paciente");
            mascotaParrafo.textContent = mascota;

            const propietarioParrafo = document.createElement("P");
            propietarioParrafo.classList.add("parrafo");
            propietarioParrafo.innerHTML = `
                <span class="card">Propietario: </span>${propietario}
            `;

            const telefonoParrafo = document.createElement("P");
            telefonoParrafo.classList.add("parrafo");
            telefonoParrafo.innerHTML = `
                <span class="card">Telefono: </span>${telefono}
            `;

            const fechaParrafo = document.createElement("P");
            fechaParrafo.classList.add("parrafo");
            fechaParrafo.innerHTML = `
                <span class="card">Fecha: </span>${fecha}
            `;

            const horaParrafo = document.createElement("P");
            horaParrafo.classList.add("parrafo");
            horaParrafo.innerHTML = `
                <span class="card">Hora: </span>${hora}
            `;

            const sintomasParrafo = document.createElement("P");
            sintomasParrafo.classList.add("parrafo");
            sintomasParrafo.innerHTML = `
                <span class="card">Síntomas: </span>${sintomas}
            `;

            // div para los botones
            const divBotones = document.createElement("DIV");
            divBotones.classList.add("botones");

            // botón para eliminar la cita
            const btnEliminar = document.createElement("BUTTON");
            btnEliminar.classList.add("btn", "btn-eliminar");
            btnEliminar.innerHTML = `Eliminar`;
            btnEliminar.onclick = () => eliminarCita(id);

            // Agregar botón para editar
            const btnEditar = document.createElement("BUTTON");
            btnEditar.classList.add("btn", "btn-editar");
            btnEditar.innerHTML = `Editar`;
            btnEditar.onclick = () => cargarEdicion(cita);

            // agregar botones al divBotones
            divBotones.appendChild(btnEliminar);
            divBotones.appendChild(btnEditar);

            // agregar elementos al divCita
            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);
            divCita.appendChild(divBotones);

            // agregar las citas al html
            contenedorCitas.appendChild(divCita);
        });
    }

    limpiarHtml() {
        while (contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
    }
}

// Instanciar clases
const ui = new Interfaz();
const administrarCitas = new Citas();

// Asignar eventos a los inputs
eventListeners();
function eventListeners() {
    mascotaInput.addEventListener("input", datosCita);
    propietarioInput.addEventListener("input", datosCita);
    telefonoInput.addEventListener("input", datosCita);
    fechaInput.addEventListener("input", datosCita);
    horaInput.addEventListener("input", datosCita);
    sintomasInput.addEventListener("input", datosCita);
    formulario.addEventListener("submit", nuevaCita);
    // console.log(mascotaInput);
}

// Objeto con información de la cita
const citaObj = {
    mascota: "",
    propietario: "",
    telefono: "",
    fecha: "",
    hora: "",
    sintomas: "",
}

// Agregar datos al objeto de la citObj
function datosCita(e) {
    citaObj[e.target.name] = e.target.value;
}

// Validar datos
function nuevaCita(e) {
    e.preventDefault();
    // Extraer la información del objeto
    const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;
    // validar
    if (mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === '') {
        ui.imprimirAlerta("Todos los campos son obligatorios", "error");
        return;
    }

    if (editando) {
        ui.imprimirAlerta("Se editó correctamente");
        administrarCitas.editarCita({ ...citaObj })
        formulario.querySelector('button[type="submit"]').textContent = "Registrar";
        editando = false;
    } else {
        // Generar un id único
        citaObj.id = Date.now();
        // crear una nueva cita
        administrarCitas.agregarCita({ ...citaObj });
        // mensaje de agregado
        ui.imprimirAlerta("Se agregó correctamente");
    }
    // reiniciar objeto
    reiniciarObjeto();
    // reiniciar formulario
    formulario.reset();
    // mostrar el html de las clases
    ui.imprimirCita(administrarCitas);
}

function reiniciarObjeto() {
    citaObj.mascota = '';
    citaObj.propietario = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.sintomas = '';
}

function eliminarCita(id) {
    administrarCitas.eliminarCita(id);
    ui.imprimirAlerta("La cita se eliminó correctamente");
    ui.imprimirCita(administrarCitas);
}

function cargarEdicion(cita) {
    const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;
    // llenar los inputs
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    // llenar el objeto
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    // cambiar el texto del botón 
    formulario.querySelector('button[type="submit"]').textContent = "Editar";

    editando = true;
}