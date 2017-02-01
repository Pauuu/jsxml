var formElement=null;
var secret=null;
var respuesta=null;
var respuestasCheckbox = [];

//**************************************************************************************************** 
//Después de cargar la página (onload) se definen los eventos sobre los elementos entre otras acciones.
window.onload = function(){ 

 //CORREGIR al apretar el botón
 formElement=document.getElementById('myform');
 formElement.onsubmit=function(){
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
function gestionarXml(dadesXml){
 //Rellenamos title y guardamos el número secreto
 var xmlDoc = dadesXml.responseXML;
 document.getElementById("title").innerHTML = xmlDoc.getElementsByTagName("title")[0].childNodes[0].nodeValue;
 secret=parseInt(xmlDoc.getElementsByTagName("answer")[0].childNodes[0].nodeValue);
 
 //Rellenamos selecttitle
 document.getElementById("selecttitle").innerHTML = xmlDoc.getElementsByTagName("title")[1].childNodes[0].nodeValue;
 
 //RECUERDA document se refiere al documento HTML, xmlDOC es el documento leido XML.
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

 //Checkbox
 var checkboxContainer=document.getElementById('checkboxContainer');
 //Añadimos un párrafo para albergar el título de la pregunta de checkbox
 var h3 = document.createElement("h3");
 h3.innerHTML = xmlDoc.getElementsByTagName("title")[2].childNodes[0].nodeValue;
 checkboxContainer.appendChild(h3);
 
 //añadimos todas las opciones de checkbox
 var nopciones = xmlDoc.getElementById("profe_003").getElementsByTagName('option').length;
 
 //Bucle para rellenar todas las opciones checkbox
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
 //guardamos todas las respuestas correctas
 var nrespuestas = xmlDoc.getElementById("profe_003").getElementsByTagName('answer').length;
 //Bucle para guardar las respuestas
 for (i = 0; i < nrespuestas; i++) { 
  respuestasCheckbox[i]=xmlDoc.getElementById("profe_003").getElementsByTagName("answer")[i].childNodes[0].nodeValue
 }
}

//****************************************************************************************************
//implementación de la corrección y su presentación
function corregirNumber(){
  var resultContainer=document.getElementById('resultContainer');
  resultContainer.innerHTML = ""; //vaciar cada vez
  var s=formElement.elements[0].value; 
  
  var para = document.createElement("p");
  var node = null;  
  
  //corrección número secreto
  if (s==secret) node = document.createTextNode("P1: Exacto!");
  else {
    if (s>secret) node = document.createTextNode("P1: Te has pasado");
    else node = document.createTextNode("P1: Te has quedado corto");
  }
  para.appendChild(node);
  resultContainer.appendChild(para);
}

function corregirSelect(){
  var sel = formElement.elements[1];  
  var para = document.createElement("p");
  var node = null;  
  if (sel.selectedIndex==respuesta) node = document.createTextNode("P2: Select correcto");
  else node = document.createTextNode("P2: Select incorrecto");
  para.appendChild(node);
  resultContainer.appendChild(para);
}

function corregirCheckbox(){
  var f=document.getElementById('myform');
  var escorrecta = [];
  for (i = 0; i < f.color.length; i++) {
   //incompleto...
   if (f.color[i].checked) {
    for (j = 0; j < respuestasCheckbox.length; j++) {
     if (i==respuestasCheckbox[j]) escorrecta[i]=true; else escorrecta[i]=false;
    }
   } 
  }
  for (i = 0; i < f.color.length; i++) {
   var para = document.createElement("p");
   if (escorrecta[i]) {
    node = document.createTextNode("P3: "+i+" correcta");
    //else node = document.createTextNode("P3: tienes respuestas incorrectas");
    para.appendChild(node);
    resultContainer.appendChild(para);
   }
  }
}
