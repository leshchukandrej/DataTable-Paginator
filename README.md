# DataTable-Paginator
  Component that wraps lightning:datatable and split records into separate pages.

  It finds only first aura:iteration tag, other aura:iteration tags would be ignored

  Example of using this component:

```
    <c:DataTablePaginator elementsPerPage="{!v.recordsPerPage}" items="{!v.data}">

        <lightning:datatable keyField="Id" columns="{!v.columns}"/>
                                     
    </c:DataTablePaginator>
```    
  As you can see in example, you don't need to put value into data attribute in lightning:dataTable. It's automatically splits records to pages and fills in by DataTablePaginator, where you need to put your records into "items" attribute.

[![DataTablePaginator](https://github.com/leshchukandrej/DataTable-Paginator/blob/master/DataTablePaginator.png)](https://github.com/leshchukandrej/DataTable-Paginator/blob/master/DataTablePaginator.png)

  You can use Paginator with dynamically loaded elements. For using DataTablePaginator in this case, you should put in attribute isRecordsLoadsDynamically value "true" and handle onChangePage event. In this event, you will receive "offset" and "itemsPerPage" attributes by wich you should query records with OFFSET and LIMIT values in SOQL. 
  Example of using:

```
    <c:DataTablePaginator isRecordsLoadsDynamically="true" 
                                      elementsPerPage="{!v.itemsPerPage}" shownItems="{!v.records}" 
                                      onChangePage="{!c.loadSpecificRecords}" pages="{!v.pages}">

          <lightning:datatable keyField="Id" data="{!v.records}" columns="{!v.columns}"/>
          
    </c:Paginator>
    
```
###  Attention!!! When you receive this values from Lightning Components in Apex methods, you should always transform received values into Integer even you received an integer values. 
  Like this: 
  
  ```
  Integer limitValue = Integer.valueOf(variable1);
  Integer offsetValue = Integer.valueOf(variable2);
  ```
