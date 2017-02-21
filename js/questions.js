var formElement=null;
var numeroSecreto=null;
var respuestaSelect=null;
var respuestasCheckbox = [];
var nota = 0;  //nota de la prueba sobre 3 puntos (hay 3 preguntas)
var xmlDoc = null; //global, para modificarlo y serializarlo (y sacarlo por pantalla)
var xslDoc = null;

//**************************************************************************************************** 
//Después de cargar la página (onload) se definen los eventos sobre los elementos entre otras acciones.
window.onload = function(){ 

 //CORREGIR al apretar el botón
 formElement=document.getElementById('myform');
 formElement.onsubmit=function(){
   inicializar();
   if (comprobar()){
    corregirNumber();
    corregirSelect();
    corregirCheckbox();
    presentarNota();
   }
   return false;
 }
 
 //LEER XML de xml/preguntas.xml
 xmlDoc=loadXMLDoc("xml/preguntas.xml");
 xslDoc=loadXMLDoc("xml/transform.xsl");
}

//**************************************************************************************************** 
//para leer documentos externos
function loadXMLDoc(filename) {
        if (window.ActiveXObject) {
             xhttp = new ActiveXObject("Msxml2.XMLHTTP");
        } else {
             xhttp = new XMLHttpRequest();
        }
        xhttp.open("GET", filename, false);
        xhttp.send("");
        return xhttp.responseXML;
     }

//****************************************************************************************************
// Recuperamos los datos del fichero XML xml/preguntas.xml
// xmlDOC es el documento leido XML. 
function gestionarXml(dadesXml){
 xmlDoc = dadesXml.responseXML; //Parse XML to xmlDoc
 
 //NUMBER
 //Recuperamos el título y la respuesta correcta de Input, guardamos el número secreto
 var tituloInput=xmlDoc.getElementsByTagName("title")[0].innerHTML;
 ponerDatosInputHtml(tituloInput);
 numeroSecreto=parseInt(xmlDoc.getElementsByTagName("answer")[0].innerHTML);
 
 //SELECT
 //Recuperamos el título y las opciones (que están dentro de los nodos seleccionados con Xpath: nodesSelect) 
 var tituloSelect=xmlDoc.getElementsByTagName("title")[1].innerHTML;
 var xpath="/questions/question[@id='profe_002']/option";
 var nodesSelect = xmlDoc.evaluate(xpath, xmlDoc, null, XPathResult.ANY_TYPE, null);
 ponerDatosSelectHtml(tituloSelect,nodesSelect);
 //guardamos la respuesta correcta
 respuestaSelect=parseInt(xmlDoc.getElementsByTagName("answer")[1].innerHTML);

 //CHECKBOX
 //Recuperamos el título y las opciones (que están dentro de los nodos seleccionados con Xpath: nodesSelect)
 var tituloCheckbox = xmlDoc.getElementsByTagName("title")[2].innerHTML;
 var opcionesCheckbox = [];
 var xpath="/questions/question[@id='profe_003']/option";
 var nodesCheckbox = xmlDoc.evaluate(xpath, xmlDoc, null, XPathResult.ANY_TYPE, null); 
 ponerDatosCheckboxHtml(tituloCheckbox,nodesCheckbox);
 //guardamos las respuestas correctas
 var nres = xmlDoc.getElementById("profe_003").getElementsByTagName('answer').length;
 for (i = 0; i < nres; i++) { 
  respuestasCheckbox[i]=xmlDoc.getElementById("profe_003").getElementsByTagName("answer")[i].innerHTML;
 }
}

//****************************************************************************************************
//implementación de la corrección

function corregirNumber(){
  //Vosotros debéis comparar el texto escrito con el texto que hay en el xml
  //en este ejemplo hace una comparación de números enteros
  var s=formElement.elements[0].value;     
  if (s==numeroSecreto) {
   darRespuestaHtml("P1: Exacto!");
   nota +=1;
  }
  else {
    if (s>numeroSecreto) darRespuestaHtml("P1: Te has pasado");
    else darRespuestaHtml("P1: Te has quedado corto");
  }
}

function corregirSelect(){
  //Compara el índice seleccionado con el valor del íncide que hay en el xml (<answer>2</answer>)
  //para implementarlo con type radio, usar value para enumerar las opciones <input type='radio' value='1'>...
  //luego comparar ese value con el value guardado en answer
  var sel = formElement.elements[1];  
  if (sel.selectedIndex-1==respuestaSelect) {
   darRespuestaHtml("P2: Correcto");
   nota +=1;
  }
  else darRespuestaHtml("P2: Incorrecto");
}

//Si necesitáis ayuda para hacer un corregirRadio() decirlo, lo ideal es que a podáis construirla modificando corregirCheckbox
function corregirCheckbox(){
  //Para cada opción mira si está checkeada, si está checkeada mira si es correcta y lo guarda en un array escorrecta[]
  var f=formElement;
  var escorrecta = [];
  for (i = 0; i < f.color.length; i++) {  //"color" es el nombre asignado a todos los checkbox
   if (f.color[i].checked) {
    escorrecta[i]=false;     
    for (j = 0; j < respuestasCheckbox.length; j++) {
     if (i==respuestasCheckbox[j]) escorrecta[i]=true;
    }
    //si es correcta sumamos y ponemos mensaje, si no es correcta restamos y ponemos mensaje.
    if (escorrecta[i]) {
     nota +=1.0/respuestasCheckbox.length;  //dividido por el número de respuestas correctas   
     darRespuestaHtml("P3: "+i+" correcta");    
    } else {
     nota -=1.0/respuestasCheckbox.length;  //dividido por el número de respuestas correctas   
     darRespuestaHtml("P3: "+i+" incorrecta");
    }   
   } 
  }
}

//****************************************************************************************************
// poner los datos recibios en el HTML
function ponerDatosInputHtml(t){
 document.getElementById("tituloInput").innerHTML = t;
}

function ponerDatosSelectHtml(t,nodes){
  document.getElementById("tituloSelect").innerHTML=t;
  var select = document.getElementsByTagName("select")[0];
  var result = nodes.iterateNext();
  i=0;
  while (result) {
   var option = document.createElement("option");
   option.text = result.innerHTML;
   option.value=i+1; i++;
   select.options.add(option);
   result = nodes.iterateNext();
  }  
}

function ponerDatosCheckboxHtml(t,nodes){
 var checkboxContainer=document.getElementById('checkboxDiv');
 document.getElementById('tituloCheckbox').innerHTML = t;
  var result = nodes.iterateNext();
  i=0;
  while (result) {
   var input = document.createElement("input");
   var label = document.createElement("label");   
   label.innerHTML = result.innerHTML
   label.setAttribute("for", "color_"+i);
   input.type="checkbox";
   input.name="color";
   input.id="color_"+i; i++;
   checkboxContainer.appendChild(input);
   checkboxContainer.appendChild(label);
   checkboxContainer.appendChild(document.createElement("br"));
   result = nodes.iterateNext();
  }    
}

//****************************************************************************************************
//Gestionar la presentación de las respuestas
function darRespuestaHtml(r){
 var p = document.createElement("p");
 var node = document.createTextNode(r);
 p.appendChild(node);
 document.getElementById('resultadosDiv').appendChild(p);
}

function presentarNota(){
   darRespuestaHtml("Nota: "+nota+" puntos sobre 3");
   //Código transformación xslt con xmlDoc y xslDoc
   if (document.implementation && document.implementation.createDocument) {
        xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(xslDoc);
        resultDocument = xsltProcessor.transformToFragment(xmlDoc, document);
        document.getElementById('resultadosDiv').appendChild(resultDocument);
     }
}

function inicializar(){
   document.getElementById('resultadosDiv').innerHTML = "";
   nota=0.0;  
}

//Comprobar que se han introducido datos en el formulario
function comprobar(){
   var f=formElement;
   var checked=false;
   for (i = 0; i < f.color.length; i++) {  //"color" es el nombre asignado a todos los checkbox
      if (f.color[i].checked) checked=true;
   }
   if (f.elements[0].value=="") {
    f.elements[0].focus();
    alert("Escribe un número");
    return false;
   } else if (f.elements[1].selectedIndex==0) {
    f.elements[1].focus();
    alert("Selecciona una opción");
    return false;
   } if (!checked) {    
    document.getElementsByTagName("h3")[2].focus();
    alert("Selecciona una opción del checkbox");
    return false;
   } else  return true;
}
