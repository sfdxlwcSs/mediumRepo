/**
 * @File Name          : demoClass.cls
 * @Description        : 
 * @Author             : Somnath Sharma
 * @Group              : 
 * @Last Modified By   : Somnath Sharma
 * @Last Modified On   : 2/24/2020, 10:58:36 AM
 * @Modification Log   : 
 * Ver       Date            Author      		    Modification
 * 1.0    2/21/2020   Somnath Sharma     Initial Version
**/
public with sharing class demoClass {
   
      @AuraEnabled
    public static List<Account> getAllAccounts(){
        return [Select Id,Name From Account];
    }
     @AuraEnabled
    public static List<Contact> getAllContacts(){
        return [Select Id,Name,AccountId From Contact];
    }

     @AuraEnabled(cacheable=true)
    public static List<Contact> getContactList(){
        return [Select Id,Name From Contact limit 5];
    }

     @AuraEnabled(cacheable=true)
    public static List<Contact> findContacts(String searchKey) {
        String key = '%' + searchKey + '%';
        return [
            SELECT Id, Name, Title, Phone, Email
            FROM Contact
            WHERE Name LIKE :key 
            WITH SECURITY_ENFORCED
            LIMIT 10
        ];
    }

     @AuraEnabled(cacheable=true)
    public static List<Account> getAllAccountsForDataTable(){
        return [Select Id,Name From Account limit 5];
    }
}