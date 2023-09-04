public class SpeechToTextSearch {
    
     @AuraEnabled
    public static List<List<sObject>> searchResults(String searchStr){
        
      //  List<String> lstAlpha = searchStr.split(' ');
        String searchStr1 = '%'+searchStr+'%';
        String searchQuery = 'FIND \'' + searchStr1 + '\' IN ALL FIELDS RETURNING Account (Id,Name,type Limit 5),Contact(FirstName,LastName  Limit 5),Opportunity(Name,StageName  Limit 5), Lead(Id,FirstName, LastName  Limit 5) ';
        System.debug('searchQuery--->>'+searchQuery);
        List<List <sObject>> searchLists = search.query(searchQuery);
        System.debug('searchQuery--->>'+searchLists);
        return searchLists;
         
    }

}