var formElement=null;
var secret=50; //ahora se lee 23 de <answer>23</answer> suministrado en preguntas.xml
 
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
 
 //Para corregir gestionamos el contenido introducido en el formulario
 formElement=document.getElementById('myform');
 formElement.onsubmit=function(){
  var s=formElement.elements[0].value; 
  if (s==secret) alert('Número correcto');
  else {
    if (s>secret) alert('te has pasado');
    else alert('te has quedado corto');
  }
  return false;
 }
}

//funcion donde cogemos los datos del xml y los ponemos en el html 
function gestionarXml(dadesXml){
 var xmlDoc = dadesXml.responseXML;
 document.getElementById("title").innerHTML = xmlDoc.getElementsByTagName("title")[0].childNodes[0].nodeValue;
 secret=parseInt(xmlDoc.getElementsByTagName("answer")[0].childNodes[0].nodeValue);
}

