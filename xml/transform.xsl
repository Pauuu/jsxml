<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/">
  <html>
  <body>
  <h2>Questions</h2>
  <table border="1">
    <tr bgcolor="#cdd8f6">
      <th>Title</th>
      <th>Answer</th>
    </tr>
    <xsl:for-each select="questions/question">
    <tr>
      <td><xsl:value-of select="title"/></td>
      <td>
       <xsl:for-each select="option">
        <xsl:variable name="i" select="position()"/> 
        <xsl:value-of select="$i"/>
         <xsl:for-each select="answer">
            <xsl:value-of select="text()"/>
            <xsl:variable name="t" select="text()"/>
            <xsl:if test="$i=$t">
              Correcto
            </xsl:if>      
          </xsl:for-each>
         <br/>
       </xsl:for-each>
      </td>
    </tr>
    </xsl:for-each>
  </table>
  </body>
  </html>
</xsl:template>

</xsl:stylesheet>
