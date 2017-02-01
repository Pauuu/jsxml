var formElement=null;
var secret=50; //ahora se lee 23 de <answer>23</answer> suministrado en preguntas.xml
var respuesta=null;
var respuestasCheckbox = [];
 
//al cargar la página... 
window.onload = function(){ 

 //pide los datos, lee preguntas.xml del servidor (por http)
 var xhttp = new XMLHttpRequest();
 xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
   gestionarXml(this);
  }
 };
 xhttp.open("GET", "xml/preguntas.xml", true);
 xhttp.send();
 
 
 //Para corregir gestionamos el contenido introducido en el formulario y rellenamos resultContainer con los resulados
 formElement=document.getElementById('myform');
 formElement.onsubmit=function(){
  var resultContainer=document.getElementById('resultContainer');
  resultContainer.innerHTML = "";
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
  
  //corrección select
  var sel = formElement.elements[1];  
  var para = document.createElement("p");
  var node = null;  
  if (sel.selectedIndex==respuesta) node = document.createTextNode("P2: Select correcto");
  else node = document.createTextNode("P2: Select incorrecto");
  para.appendChild(node);
  resultContainer.appendChild(para);
  return false;
 }
}

//función donde cogemos los datos del xml y los ponemos en el html 
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
 var p = document.createElement("p");
 p.innerHTML = xmlDoc.getElementsByTagName("title")[2].childNodes[0].nodeValue;
 checkboxContainer.appendChild(p);
 
 //añadimos todas las opciones de checkbox
 var nopciones = xmlDoc.getElementById("profe_003").getElementsByTagName('option').length;
 
 //Bucle para rellenar todas las opciones checkbox
 for (i = 0; i < nopciones; i++) { 
    var input = document.createElement("input");
    var label = document.createElement("label");
    label.innerHTML = xmlDoc.getElementById("profe_003").getElementsByTagName('option')[i].childNodes[0].nodeValue;
    label.for="color_"+i;
    input.type="checkbox";
    input.id="color_"+i;;
    checkboxContainer.appendChild(input);
    checkboxContainer.appendChild(label);
 }  
 
 
}
