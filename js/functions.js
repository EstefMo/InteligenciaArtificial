totalSymptoms = 19;

function goNosotras(){
	location.href = "http://localhost/2019/2019-2/inteligenciaArtificial/nosotras.html";
}

function goEspecifico(){
	window.location.assign('especifico.html');
	// location.href = "http://localhost/inteligenciaArtificial/especifico.html";
}

function goGeneral(){
	window.location.assign('general.html');
	// location.href = "http://localhost/inteligenciaArtificial/general.html";
}

function respuestaGrado(){
	uno = document.getElementById("uno");
	dos = document.getElementById("dos");

	uno.style.display="none";
	dos.style.display="block";
}

function next(id){
	item = document.getElementById(id);

	item.style.display="block";
}


// Función para obtener resultados del usuario 
function getResults(){ 
	const respuestas  = document.querySelectorAll('input.respuesta'); 
	let valores = []; 
	for(let respuesta of respuestas) valores.push((respuesta.value/10)); 
	return valores; 
}  
function terminarGeneral(){
	//Destruir la variable de sesion existente antes de continuar
	if(localStorage.getItem("result") != null){
		localStorage.removeItem("result");
	}
	//Obtener los resultados del usuario por medio de la funcion getResults()
	usuario =  getResults();
	// Generar una peticion por medio de XML a el archivo JSON que contiene las enfermedades
	var request = new XMLHttpRequest();
	request.open('GET', 'js/enfermedades.json', true);
	request.send();
	request.onreadystatechange = function () {
		//Verificar que la transaccion se haya realizado de manera correcta
		if (this.readyState == 4 && this.status == 200) {
			var req = JSON.parse(this.responseText);
			var enfermedades = req['Enfermedades'];
			var EArray = [];
			var e = [];
			for(let i=0; i< Object.keys(enfermedades).length;i++){
				//Obtener un arreglo de las enfermedades que se encuentran en el JSON
				enf = Object.keys(enfermedades)[i];
				//Obtener el arreglo con los sintomas de cada enfermedad y generar la matriz
				sin = enfermedades[enf]['Sintomas'];
				e.push(enf);
				EArray.push(sin);
				}
			//Hacer uso de la funcion getMaxMin para obtener la enfermedad 
			result = getMaxMin(EArray,usuario, e);
		}
		// Almacenar el resultado en el sessionStorage para su posterior uso
		sessionStorage.setItem("result",JSON.stringify(result));
		navegar('resultado');
	}
}
function terminarEspe(){
	if(sessionStorage.getItem("result") != null){
		sessionStorage.removeItem("result");
	}
	usuario =  getResults();

	var request = new XMLHttpRequest();
	request.open('GET', 'js/enfermedades.json', true);
	request.send();
	request.onreadystatechange = function () {
		console.log("entro");
		if (this.readyState == 4 && this.status == 200) {
			
			
			var req = JSON.parse(this.responseText);
			var enfermedades = req['Enfermedades'];
			var EArray = [];
			var e = [];
			var enfEsp = JSON.parse(localStorage.getItem('enf'));
			console.log((enfEsp.data).length);

			for (dataI in enfEsp.data){
				console.log((enfEsp.data)[dataI]);
				sin = enfermedades[(enfEsp.data)[dataI]]['Sintomas'];
				console.log(sin);
				
				e.push((enfEsp.data)[dataI]);
				EArray.push(sin);
			}

			result = getMaxMin(EArray,usuario, e);
			console.log(result);
			
			sessionStorage.setItem("result",JSON.stringify(result));
		}
		navegar('resultado');
	}
	
}
function getMaxMin(a, b, c){
    //Sumatoria minima de los sintomas
    umbral = 3;
    
    // Dimensiones x*z
    let ArrMin = [];
    // Recorrer cada fila del arreglo a
    for(let i = 0; i < a.length; i++){

        // Arreglo temporal para guardar valores máx de cada fila
            let temp = [];

        // Recorrer por n* veces -> (tamaño de b)
            for(let j = 0; j < b.length; j++){

                let min = [];

				x = a[i][j];
                z = b[j];
                //Obtener la interseccion entre el valor del sintoma y el valor del usuario.
                min = Math.min(x, z);
				// console.log(min);
				
                // Agregar valores minimos al arreglo temporal
                    temp.push(min);
            }
        // Agregar arreglo temporal al arreglo final de maxmin
            ArrMin.push([c[i],temp]);
	}

	var mayor=0;
	//Arreglo donde se almacenan los resultados
	var	mayorArr=["no hay coincidencias",0];
	arrSuma=[];
	for(let h = 0; h < ArrMin.length; h++){
		suma = 0;
		// Generar la sumatoria de los valores devueltos por la interseccion
		for(let k = 0; k < ArrMin[h][1].length; k++){
			suma=suma+ArrMin[h][1][k];
		}
		arrSuma.push(suma)
		// comprobar que la sumatoria sobrepase el umbral especificado
		if(suma > umbral){
			// validar cual sumatoria es la mayor y actualizar el valor mayor
			if(suma > mayor){
				mayor = suma;
				mayorArr = []
				
				mayorArr.push([ArrMin[h],mayor]);
			}else{
				if (suma == mayor){
					mayor = suma;
					mayorArr.push([ArrMin[h],mayor]);
				}
			}
		}
	}
	//devolver el arreglo de enfermedad de ponderacion mayor
    return(mayorArr);
}

var selected = [];
function selectEnf(id){	
	let bandera = false;
	try{
		item = document.getElementById(id);
		for(let clase of item.classList){
			if(clase === 'ui-selected') bandera = true;
		}
		if(bandera){
			item.classList.remove('ui-selected');
			selected = selected.filter(option => option != item.id);
		}
		else{
			item.classList.add('ui-selected');
			selected.push(item.id);

		}
	} catch(error){
		console.log(error);
	}
	// localStorage.setItem("select",selected);
	// console.log(selected);
}

function iniciar(){
	data =[]
		$('.ui-selected').each(function() {
			// console.log($("#"+this.id+"_d").html());
			data.push($("#"+this.id+"_d").html())
		});
		obj = {"data":data}
		localStorage.setItem("enf",JSON.stringify(obj));
		try{
			if (data.length==0){
				alert("Debes elegir al menos una enfermedad")
			}else{
				navegar('especifico-preg');
			}
			
		} catch (error){
			console.log(error);
		}
	
}


function cargar(){
	if (sessionStorage.getItem("result")!=null){
		res = JSON.parse(sessionStorage.getItem("result"));	
		console.log(res);
		if (res[0]!="no hay coincidencias"){	
			var request = new XMLHttpRequest();
			request.open('GET', 'js/enfermedades.json', true);
			request.send();
			request.onreadystatechange = function () {
				if (this.readyState == 4 && this.status == 200) {
					var req = JSON.parse(this.responseText);				
					var enfermedades = req['Enfermedades'];
					var enfermedad = enfermedades[res[0][0][0]];
					console.log(enfermedades[res[0][0]]);
					origin = enfermedad['Origen'];
					trat = enfermedad['tratamiento'];
					$("#nombre").html(res[0][0][0]);
					$("#image").attr("src","img/"+res[0][0][0]+".jpg");
					$("#title-origen").html('Origen:');
					$("#origen").html(origin);
					$("#title-tratamiento").html('Tratamiento:');
					$("#tratamiento").html(trat);
				}
			}
		}else{
			$("#nombre").html("No hay enfermedades que coincidan");
			$("#image").attr("src","img/notFound.jpg");
		}
	}else{
		navegar('index')
	}
}


// ---------------------------
function obtenerpreg(){
	$('.question').each(function() {
		console.log(this.id);
	});
}
function navegar(url){
	window.location.assign(`${url}.html`);
}

function changeClass(htmlElement, className){
	document.getElementById(htmlElement).classList.toggle(className);
}

function changeQuestion(direction){
	let id = parseInt(document.querySelector('.question').id);

	if(direction == 'left'){
	
		if(id > 1 && direction == 'left'){
			changeQuestionLeft();
			document.getElementById('right-arrow').classList.remove('noactive');
		}
		if(id - 1 === 1){
			document.getElementById('left-arrow').classList.add('noactive');
		}
	}
	if(direction == 'right'){
		if(id < totalSymptoms){
			changeQuestionRight();
		}
		if(id + 1 === totalSymptoms){
			document.getElementById('right-arrow').classList.add('noactive');
		}
	}
}

function changeQuestionLeft(){
	let id = parseInt(document.querySelector('.question').id); 

	changeClass(id, 'item');
	changeClass(id, 'question');

	changeClass(id - 1, 'question');
	changeClass(id - 1, 'item');
}

function changeQuestionRight(){
	let id = parseInt(document.querySelector('.question').id); 
	if(id === 1){
		changeClass('left-arrow', 'noactive');
	}

	changeClass(id, 'item');
	changeClass(id, 'question');

	changeClass(id + 1, 'question');
	changeClass(id + 1, 'item');
}
