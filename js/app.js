//Variables y selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');


//Eventos

eventListeners();
function eventListeners(){
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

    formulario.addEventListener('submit',agregarGasto );
}



//Clases
class Presupuesto{
    
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto); //no se modifica
        this.restante = Number(presupuesto); //va modificandose
        this.gastos = []; //ingresamos los gastos
    }

    //nuevo metodo
    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto];  //forma en la que hacemos referencia a otros atri en el mismo obj
        this.calcularRestante();
    }

    calcularRestante(){
        const gastado = this.gastos.reduce( (total,gastos) => total + gastos.cantidad, 0); //itera sobre todo el array
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter( gasto => gasto.id !== id);
        this.calcularRestante();
    }
}

class UI{
    insertarPresupuesto(cantidad){
        //Extrayendo valores
        const {presupuesto,restante} = cantidad;

        //Insertando al HTML
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }


        //tomara dos parametros
        imprimirAlerta(mensaje, tipo){
            //crear el div
            const divMensaje = document.createElement('div');
            divMensaje.classList.add('text-center' , 'alert');

            if(tipo === 'error'){
                divMensaje.classList.add('alert-danger');
            }else{
                divMensaje.classList.add('alert-success');
            }
            //mensaje error
            divMensaje.textContent = mensaje;

            //insertar en el html
            document.querySelector('.primario').insertBefore(divMensaje, formulario);

            //quitar html
            setTimeout(() => {
                divMensaje.remove();
            }, 3000);
        }

        mostrarGastos(gastos){

            //llamamos a la funcion
            this.limpiarHTML();

            //iterar sobre los gastos
            gastos.forEach(gasto =>{

                const {cantidad, nombre, id} = gasto; //Aplicamos de destructuring

                //creamos un LI
                const nuevoGasto = document.createElement('li');
                nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
                nuevoGasto.dataset.id = id; 
                
                //agregamos el HTML del gasto
                nuevoGasto.innerHTML = `${nombre}<span class="badge badge-primary badge-pill">$ ${cantidad}</span>` 

                //borramos los gastos
                const btnBorrar = document.createElement('button');
                btnBorrar.classList.add('btn', 'btn-danger' , 'borrar-gasto');
                btnBorrar.innerHTML = 'Borrar &times';
                btnBorrar.onclick = () =>{ //pasando un parametro 
                    eliminarGasto(id);
                }
                nuevoGasto.appendChild(btnBorrar);

                //agregamos al HTML
                gastoListado.appendChild(nuevoGasto);
            })
        }

        limpiarHTML(){
            while(gastoListado.firstChild){
                gastoListado.removeChild(gastoListado.firstChild);
            }
        }

        actualizarRestante(restante){
            document.querySelector('#restante').textContent = restante;
        }

        comprobarPresupuesto(presupuestoObj){
            const{presupuesto,restante} = presupuestoObj;

            const restanteDiv = document.querySelector('.restante');

            //comprobar 25%
            if((presupuesto / 4) > restante){
                restanteDiv.classList.remove('alert-success', 'alert-warning');
                restanteDiv.classList.add('alert-danger');
            }else if(( presupuesto / 2 ) > restante){
                restanteDiv.classList.remove('alert-success');
                restanteDiv.classList.add('alert-warning');
            }else{
                restanteDiv.classList.remove('alert-danger', 'alert-warning');
                restanteDiv.classList.add('alert-success');
            }

            //si el total es menor al presupuesto
            if(restante <= 0){
                ui.imprimirAlerta('El presupuesto llegó al limite', 'error');

                formulario.querySelector('button[type="submit"]').disabled = true;
            }
        }
        
}
//Instanciar
const ui = new UI();
let presupuesto;

//Funciones

function preguntarPresupuesto(){
    const presupuestoUsuario = prompt('¿Cual es tu presupuesto');


    //validar la entrada de datos para aceptar , cancelar , si es un numero y no una letra y si es un pres. negativo 
    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){
        window.location.reload(); // vuelve a recargar la pagina si esta vacio
    }

    //Presupuesto valido
    presupuesto = new Presupuesto(presupuestoUsuario);

    ui.insertarPresupuesto(presupuesto);
}

//añadir gastos

function agregarGasto(e){
    e.preventDefault(); //previene la accion por default

    //leer los datos del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);


    //validamos

    if (nombre === '' || cantidad === ''){
        //llamamos a la funcion
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');

        return; //para que no se ejecute las sig lineas de codigo

    }else if(cantidad <= 0 || isNaN(cantidad)){//validad cantidad
        ui.imprimirAlerta('Cantidad no valida', 'error');

        return;//para que no se ejecute las sig lineas de codigo
    }

    //Generar un objeto con el gasto
    const gasto = {nombre,cantidad, id: Date.now()}

    //añadimos un nuevo gasto
    presupuesto.nuevoGasto(gasto);

    //reutilizamos metodo ui para la alerta bien ingresada
    ui.imprimirAlerta('Gasto agregado correctamente!');

    //imprimir los gastos
    const {gastos , restante} = presupuesto;//extraemos gasto de presupuesto
    ui.mostrarGastos(gastos);


    ui.actualizarRestante(restante);


    ui.comprobarPresupuesto(presupuesto);

    //reiniciar formulario
    formulario.reset();
}

    function eliminarGasto(id){
        //elimina el objeto de la clase
        presupuesto.eliminarGasto(id);

        //elimina los gastos del html
        const { gastos, restante } = presupuesto;
        ui.mostrarGastos(gastos);

        ui.actualizarRestante(restante);

        ui.comprobarPresupuesto(presupuesto);
        
    }