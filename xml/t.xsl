<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/">
<style rel="stylesheet" type="text/css">
table{width:100%;border:1px solid}
th{background-color:#cdd8f6}
td,tr,th{border:0px;padding:2px}
</style>
  <h2>Questions</h2>
  <table>
    <tr>
      <th>Title</th>
      <th>Option</th>
      <th>Answer</th>
    </tr>
    <xsl:for-each select="questions/question">
    <tr>
      <td><xsl:value-of select="title"/></td>
      <td>
       <xsl:for-each select="option">
        <xsl:value-of select="position()"/>: <xsl:value-of select="text()"/><br/>
       </xsl:for-each>
      </td>
      <td>
       <xsl:for-each select="answer">
        <xsl:value-of select="text()"/><br/>
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
</xsl:template>

</xsl:stylesheet>
