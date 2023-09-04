import { LightningElement, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import searchResultsData from '@salesforce/apex/SpeechToTextSearch.searchResults';
export default class BasicSpeechSynthesis extends NavigationMixin(LightningElement) {


   testvalue = "Press Enter hear it.";
   searchKey = "Speak Something";
   _speechDBResults = [];
   _speechDBAcc = [];
   _speechDBCon = [];
   _speechDBOpp = [];
   _speechDBLead = [];
   _showSpinner = false;
   _recognition;



   connectedCallback() {

      //https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition
      //https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API
      //Browsers currently support speech recognition with prefixed properties. Therefore at the start of our code we include these lines to allow for both prefixed properties and unprefixed versions that may be supported in future:
      window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      if ("SpeechRecognition" in window) {
         this._recognition = new webkitSpeechRecognition() || new SpeechRecognition();
         this._recognition.lang = 'en-US';
         //  this._recognition.continuous = true;

      }
   }



   get speechToTextDataFound() {
      return this._speechDBResults.length > 0 ? true : false;
   }



   handleClick(event) {
      this._recognition.start();
      //When a result has been successfully recognized, the result event fires
      this._recognition.onresult = (event) => {
         const msg = event.results[0][0].transcript;
         this.handleSpeechRecognized(msg);
      }
   }

   //Extract the text results and add it to the Chatter.
   handleSpeechRecognized(msg) {

      let createAccount = 'Create Account';
      let createContact = 'Create Contact';
      this.searchKey = msg;

      if (msg.toLowerCase() === createAccount.toLocaleLowerCase()) {
         this.navigateToCreatePage('Account');
      }
      else if (msg.toLowerCase() === createContact.toLocaleLowerCase()) {
         this.navigateToCreatePage('Contact');
      }
      else {
         this.handleKeyChange(msg);
      }


   }

   handleKeyChange(msg) {
      this._showSpinner = true;
      searchResultsData({ searchStr: this.searchKey })
         .then(result => {
            console.log('Search Speech To Text', JSON.stringify(result));
            this._speechDBResults = result;
            this._showSpinner = false;
            this._speechDBAcc = result[0];
            this._speechDBCon = result[1];
            this._speechDBOpp = result[2];
            this._speechDBLead = result[3];
            console.log('Account', result[0]);
            console.log('Contact', result[1]);
            console.log('Opportunity', result[2]);
            console.log('Lead', result[3]);

         })
         .catch(error => {
            console.error(error);
         });
   }

   handleClickToStop(event) {

      this._recognition.abort();
      console.log("Speech recognition has stopped.");
   }


   get showAccounts() {
      return this._speechDBAcc.length > 0 ? true : false;
   }

   handleAccClick(event) {
      console.log(event.currentTarget.dataset.accid);
      this.handleNavigation('Account', event.currentTarget.dataset.accid);
   }

   get showContacts() {
      return this._speechDBCon.length > 0 ? true : false;
   }

   handleContactClick(event) {
      console.log(event.currentTarget.dataset.conid);
      this.handleNavigation('Contact', event.currentTarget.dataset.conid);

   }

   get showOpportunities() {
      return this._speechDBOpp.length > 0 ? true : false;
   }
   handleOpportunityClick(event) {
      console.log(event.currentTarget.dataset.oppid);
      this.handleNavigation('Opportunity', event.currentTarget.dataset.oppid);
   }

   get showLeads() {
      return this._speechDBLead.length > 0 ? true : false;
   }

   handleLeadClick(event) {
      console.log(event.currentTarget.dataset.leadid);
      this.handleNavigation('Lead', event.currentTarget.dataset.leadid);
   }

   handleNavigation(soBjectName, recId) {
      this[NavigationMixin.Navigate]({
         type: 'standard__recordPage',
         attributes: {
            recordId: recId,
            objectApiName: soBjectName,
            actionName: 'view'
         }
      });
   }
   handleCardAction(event) {
      console.log(event.currentTarget.dataset.buttonname);
      switch (event.currentTarget.dataset.buttonname) {
         case 'Account':
            this.navigateToCreatePage('Account');
            break;
         case 'Contact':
            this.navigateToCreatePage('Contact');
            break;
         case 'Opportunity':
            this.navigateToCreatePage('Opportunity');
            break;
         case 'Lead':
            this.navigateToCreatePage('Lead');
            break;
         default:
         // code block
      }
   }

   handleEnter(event) {
      // on press of enter synthesis should start
      if (event.keyCode === 13) {
         var utterance = new SpeechSynthesisUtterance(event.target.value);
         window.speechSynthesis.speak(utterance);
         utterance.onstart = function (event) {
            console.log('The utterance started to be spoken.')
         };

      }
   }

   // Navigate to New Account Page
   navigateToCreatePage(sObjectName) {
      this[NavigationMixin.Navigate]({
         type: 'standard__objectPage',
         attributes: {
            objectApiName: sObjectName,
            actionName: 'new'
         },
      });
   }
}