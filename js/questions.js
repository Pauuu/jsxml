var secret=null;
var respuesta=null;
var respuestasCheckbox = [];

//**************************************************************************************************** 
//Después de cargar la página (onload) se definen los eventos sobre los elementos entre otras acciones.
window.onload = function(){ 

 //CORREGIR al apretar el botón
 var formElement=document.getElementById('myform');
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
 
 //NUMBER
 //Rellenamos title y guardamos el número secreto
 var xmlDoc = dadesXml.responseXML;
 document.getElementById("title").innerHTML = xmlDoc.getElementsByTagName("title")[0].childNodes[0].nodeValue;
 secret=parseInt(xmlDoc.getElementsByTagName("answer")[0].childNodes[0].nodeValue);
 
 //SELECT
 //Rellenamos selecttitle
 document.getElementById("selecttitle").innerHTML = xmlDoc.getElementsByTagName("title")[1].childNodes[0].nodeValue;
 var select = document.getElementsByTagName("select")[0];
 var nopciones = xmlDoc.getElementById("profe_002").getElementsByTagName('option').length; //cuantas opciones hay en el XML 
 //Bucle para rellenar todas las opciones de select
 for (i = 0; i < nopciones; i++) { 
    var option = document.createElement("option");
    option.text = xmlDoc.getElementById("profe_002").getElementsByTagName('option')[i].childNodes[0].nodeValue;
    option.value=i+1;
    select.options.add(option);
 }  
 //nos quedamos la respuesta para la corrección.
 respuesta=parseInt(xmlDoc.getElementsByTagName("answer")[1].childNodes[0].nodeValue);

 //CHECKBOX
 var checkboxContainer=document.getElementById('checkboxContainer');
 var h3 = document.createElement("h3");
 h3.innerHTML = xmlDoc.getElementsByTagName("title")[2].childNodes[0].nodeValue;
 checkboxContainer.appendChild(h3); 
 //añadimos todas las opciones de checkbox
 var nopciones = xmlDoc.getElementById("profe_003").getElementsByTagName('option').length;
 for (i = 0; i < nopciones; i++) { 
    var input = document.createElement("input");
    var label = document.createElement("label");
    label.innerHTML = xmlDoc.getElementById("profe_003").getElementsByTagName('option')[i].childNodes[0].nodeValue;
    label.setAttribute("for", "color_"+i);
    input.type="checkbox";
    input.name="color";
    input.id="color_"+i;;    
    checkboxContainer.appendChild(input);
    checkboxContainer.appendChild(label);
 }  
 //guardamos todas las respuestas correctas de checkbox
 var nrespuestas = xmlDoc.getElementById("profe_003").getElementsByTagName('answer').length;
 for (i = 0; i < nrespuestas; i++) { 
  respuestasCheckbox[i]=xmlDoc.getElementById("profe_003").getElementsByTagName("answer")[i].childNodes[0].nodeValue
 }
}

//****************************************************************************************************
//implementación de la corrección
function corregirNumber(){
  var s=formElement.elements[0].value;     
  //corrección número secreto
  if (s==secret) darRespuesta("P1: Exacto!");
  else {
    if (s>secret) darRespuesta("P1: Te has pasado");
    else darRespuesta("P1: Te has quedado corto");
  }
}

function corregirSelect(){
  var sel = formElement.elements[1];  
  if (sel.selectedIndex==respuesta) darRespuesta("P2: Select correcto");
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
function darRespuesta(r){
 var resultContainer=document.getElementById('resultContainer');
 var p = document.createElement("p");
 node = document.createTextNode(r);
 p.appendChild(node);
 resultContainer.appendChild(p);
}
function borrarCorreccion(){
   var resultContainer=document.getElementById('resultContainer');
   resultContainer.innerHTML = "";
}
