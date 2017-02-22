<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/">
<html>
<head>
<style rel="stylesheet" type="text/css">
table{width:100%;border:1px solid}
th{background-color:#cdd8f6}
td,tr,th{border:1px solid;padding:2px}
span{color:green}
</style>
</head>
<body>
  <h2>Questions</h2>
  <table>
    <tr>
      <th>Title</th>
      <th>Option</th>
      <th>Answer</th>
    </tr>
    <xsl:for-each select="questions/question">      
    <tr>
      <td>Q<xsl:value-of select="position"/>: <xsl:value-of select="title"/></td>
      <td>
       <xsl:for-each select="option">
         <xsl:variable name="optposition" select="position()-1"/>
        O<xsl:value-of select="$optposition"/>: <xsl:value-of select="text()"/>
         <xsl:for-each select="../answer">
           <xsl:variable name="correctanswer" select="text()"/>
          <xsl:if test="$optposition=$correctanswer">
            <span>This option is correct.</span>
          </xsl:if>
         </xsl:for-each><br/>
       </xsl:for-each>
      </td>
      <td>
       <xsl:for-each select="useranswer">
        <xsl:value-of select="text()"/><br/>
       </xsl:for-each>       
      </td>
    </tr>
    </xsl:for-each>
  </table>
 </body>
 </html>
</xsl:template>

</xsl:stylesheet>
