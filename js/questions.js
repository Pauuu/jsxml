var formElement=null;
var numeroSecreto=null;
var respuestaSelect=null;
var respuestasCheckbox = [];

//**************************************************************************************************** 
//Después de cargar la página (onload) se definen los eventos sobre los elementos entre otras acciones.
window.onload = function(){ 

 //CORREGIR al apretar el botón
 formElement=document.getElementById('myform');
 formElement.onsubmit=function(){
   borrarCorreccion();
   corregirNumber();
   corregirSelect();
   corregirCheckbox();  
   return false;
 }
 
 //LEER XML de xml/preguntas.xml
 var xhttp = new XMLHttpRequest();
 xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
   gestionarXml(this);
  }
 };
 xhttp.open("GET", "xml/preguntas.xml", true);
 xhttp.send();
}

//****************************************************************************************************
// XML -> HTML
//RECUERDA document se refiere al documento HTML, xmlDOC es el documento leido XML. 
function gestionarXml(dadesXml){
 var xmlDoc = dadesXml.responseXML; //Parse XML to xmlDoc
 
 //NUMBER
 //Recuperamos el título y la respuesta correcta de Input
 var tituloInput=xmlDoc.getElementsByTagName("title")[0].childNodes[0].nodeValue;
 ponerDatosInputHtml(tituloInput,respuestaInput);
 numeroSecreto=parseInt(xmlDoc.getElementsByTagName("answer")[0].childNodes[0].nodeValue);
 
 //SELECT
 //Recuperamos el título y las opciones
 var tituloSelect=xmlDoc.getElementsByTagName("title")[1].childNodes[0].nodeValue;
 var opcionesSelect = [];
 var nopt = xmlDoc.getElementById("profe_002").getElementsByTagName('option').length;
  for (i = 0; i < nopt; i++) { 
    opcionesSelect[i] = xmlDoc.getElementById("profe_002").getElementsByTagName('option')[i].childNodes[0].nodeValue;
 }
 ponerDatosSelectHtml(tituloSelect,opcionesSelect);
 respuestaSelect=parseInt(xmlDoc.getElementsByTagName("answer")[1].childNodes[0].nodeValue);

 //CHECKBOX
 //Recuperamos el título y las opciones
 var tituloCheckbox = xmlDoc.getElementsByTagName("title")[2].childNodes[0].nodeValue;
 var opcionesCheckbox = [];
 var nopt = xmlDoc.getElementById("profe_003").getElementsByTagName('option').length;
 for (i = 0; i < nopt; i++) { 
    opcionesCheckbox[i]=xmlDoc.getElementById("profe_003").getElementsByTagName('option')[i].childNodes[0].nodeValue;
 }  
 ponerDatosCheckboxHtml(tituloCheckbox,opcionesCheckbox);
 
 //guardamos todas las respuestas correctas de checkbox
 var nrespuestas = xmlDoc.getElementById("profe_003").getElementsByTagName('answer').length;
 for (i = 0; i < nrespuestas; i++) { 
  respuestasCheckbox[i]=xmlDoc.getElementById("profe_003").getElementsByTagName("answer")[i].childNodes[0].nodeValue;
 }
}

//****************************************************************************************************
//implementación de la corrección
function corregirNumber(){
  var s=formElement.elements[0].value;     
  if (s==numeroSecreto) darRespuesta("P1: Exacto!");
  else {
    if (s>numeroSecreto) darRespuesta("P1: Te has pasado");
    else darRespuesta("P1: Te has quedado corto");
  }
}

function corregirSelect(){
  var sel = formElement.elements[1];  
  if (sel.selectedIndex==respuestaSelect) darRespuesta("P2: Select correcto");
  else darRespuesta("P2: Select incorrecto");
}

function corregirCheckbox(){
  var f=document.getElementById('myform');
  var escorrecta = [];
  for (i = 0; i < f.color.length; i++) {
   if (f.color[i].checked) {
    escorrecta[i]=false;     
    for (j = 0; j < respuestasCheckbox.length; j++) {
     if (i==respuestasCheckbox[j]) escorrecta[i]=true;
    }
   } 
  }
  for (i = 0; i < f.color.length; i++) {
   
   if (f.color[i].checked) {
    if (escorrecta[i]) {
     darRespuesta("P3: "+i+" correcta");    
    } else {
     darRespuesta("P3: "+i+" incorrecta");
    }   
   }
  }
}

//****************************************************************************************************
//implementación de la presentación
function ponerDatosInputHtml(t){
 document.getElementById("tituloInput").innerHTML = t;
}

function ponerDatosSelectHtml(t,opt){
  document.getElementById("tituloSelect").innerHTML=t;
  var select = document.getElementsByTagName("select")[0];
  for (i = 0; i < opt.length; i++) { 
    var option = document.createElement("option");
    option.text = opt[i];
    option.value=i+1;
    select.options.add(option);
 }  
}

function ponerDatosCheckboxHtml(t,opt){
 var checkboxContainer=document.getElementById('checkboxDiv');
 var h3 = document.createElement("h3");
 h3.innerHTML = t;
 checkboxContainer.appendChild(h3); 
 for (i = 0; i < opt.length; i++) { 
    var input = document.createElement("input");
    var label = document.createElement("label");
    label.innerHTML=opt[i];
    label.setAttribute("for", "color_"+i);
    input.type="checkbox";
    input.name="color";
    input.id="color_"+i;;    
    checkboxContainer.appendChild(input);
    checkboxContainer.appendChild(label);
 }  
}


function darRespuesta(r){
 var resDiv=document.getElementById('resultadosDiv');
 var p = document.createElement("p");
 var node = document.createTextNode(r);
 p.appendChild(node);
 resDiv.appendChild(p);
}

function borrarCorreccion(){
   var resDiv=document.getElementById('resultadosDiv');
   resDiv.innerHTML = "";
}
