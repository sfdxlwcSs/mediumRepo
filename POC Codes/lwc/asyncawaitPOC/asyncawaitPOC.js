import { LightningElement, track } from 'lwc';
/***********Apex Calls */
import allAcc from '@salesforce/apex/demoClass.getAllAccounts'
import allContacts from '@salesforce/apex/demoClass.getAllContacts'

export default class AsyncawaitPOC extends LightningElement {

    @track contacts = [];
    @track accts = [];

    connectedCallback() {
        //code
    }

    // When await allAcc() is encountered, it will wait for the promise returned by allAcc() to resolve. 
    //During this time, the execution of the function will pause. Once the promise is resolved (or rejected),
    // the execution will continue from where it left off.

    // This behavior of pausing execution until the promise is resolved is what allows async/await to provide a more 
    //synchronous-like flow in asynchronous code, making it easier to reason about and write asynchronous JavaScript.
    //so   console.log('came here first' + JSON.stringify(data)); will be printed first then
    // console.log('Executed after Promise resolved ');
    async handleGetAccountsAsyncAwait() {
        try {
            const data = await allAcc();
            console.log('came here first' + JSON.stringify(data));
        } catch (error) {
            console.error('Error fetching accounts: ' + JSON.stringify(error));
            // Handle error if needed
        } finally {
            // Perform any actions needed in the finally block
        }
        console.log('Executed after Promise resolved ');
    }

    //arrow operator syntax
    handleGetContactsAsyncAwait = async () => {
        try {
            const data = await allContacts();
            console.log('came here first' + JSON.stringify(data));
        } catch (error) {
            console.error('Error fetching contacts: ' + JSON.stringify(error));
        } finally {
            // Perform any actions needed in the finally block
        }
        console.log('then came here');
    };


    // Understanding Promises and Promise Resolving:
    // Promises are objects representing the eventual completion or failure of an asynchronous operation. 
    //They provide a cleaner alternative to callback-based approaches and allow for easier management of asynchronous code. 
    //In LWC, promises are frequently used when making asynchronous server calls using Apex methods or fetching data
    // from external APIs.

    // Handling Promise Resolving with .then():
    // When a promise successfully resolves, the .then() method is called, providing access to the resolved value. 
    //Within the .then() block, you can specify the actions to be performed with the resolved data.
    // This could include processing the data, updating UI elements, or triggering subsequent asynchronous operations.

    //Please note console.log('Executed before Promise is resolved.'); will be printed first then 
    // console.log('Accounts fetched successfully: ' + JSON.stringify(data)); once promise is resolved
    // Example of .then() Block:
    handlePromise() {
        allAcc()
            .then((data) => {
                // This block is executed when the promise resolves successfully
                console.log('Accounts fetched successfully: ' + JSON.stringify(data));
                // Perform actions with the fetched data
            })
            .catch((error) => {
                // Handle errors if the promise is rejected
                console.error('Error fetching accounts: ' + JSON.stringify(error));
            })

        console.log('Executed before Promise is resolved.');
    }

    // Promise Chaining in JavaScript:
    // Promise chaining is a powerful feature that enables you to execute multiple asynchronous operations in a specific order, ensuring that each operation depends on the successful completion of the previous one. This approach is particularly useful when you have dependent asynchronous tasks that need to be executed sequentially.

    // Sequencing Asynchronous Operations:
    // Promise chaining allows you to sequence asynchronous operations by chaining together .then() methods. Each .then() method is invoked with the result of the previous operation, enabling you to perform additional actions or transformations on the data before moving to the next step.

    // Handling Successive Steps:
    // In a promise chain, each .then() block handles the successful resolution of the preceding promise. Within each .then() block, you can specify the actions to be performed with the resolved data or trigger the next asynchronous operation.

    // Error Handling:
    // Promise chaining also provides a convenient way to handle errors throughout the chain. By attaching a single .catch() block at the end of the chain, you can catch and handle any errors that occur during the execution of any of the promises in the chain.

    // Example of Promise Chaining:
    // In this example, allAcc() is called first, and when it resolves successfully, the .then() block 
    // processes the account data and returns a new promise (allContacts({})). The subsequent .then() 
    // block handles the successful resolution of the contacts promise and processes the contact data.
    //  If any error occurs in any step of the chain, it is caught and handled in the .catch() block at the end of the chain.

    handlePromiseChaining() {
        allAcc({})
            .then((accountResults) => {
                // Process account data or perform actions
                console.log('Accounts fetched successfully: ' + JSON.stringify(accountResults));
                // Return a new promise (result of allContacts) to continue the chain
                return allContacts({}); //{} pass params here for the apex function or result from allAcc call
            })
            .then((contactResults) => {
                // Process contact data or perform actions
                console.log('Contacts fetched successfully: ' + JSON.stringify(contactResults));
                // Continue chaining or return another promise
            })
            .catch((error) => {
                // Handle errors that occur in any step of the chain
                console.error('Error fetching data: ' + JSON.stringify(error));
            });
        console.log('Executed before Promise is resolved.');
    }

    // //Promise.all() is used to await multiple promises concurrently. It takes an array of promises as input and returns 
    //a single promise that resolves when all of the input promises have resolved, or rejects when any of the input 
    //promises is rejected.
    // The await keyword is used to wait for the resolution of the Promise.all() call, which resolves to an array 
    //containing the resolved values of the allAcc() and allContacts() promises.
    // The resolved values are destructured into accounts and contacts.
    // Subsequent actions can be performed with the fetched accounts and contacts data.
    // If any of the promises is rejected, the error is caught by the catch block.
    // This approach allows you to fetch multiple sets of data concurrently, maximizing efficiency by reducing the overall time 
    //taken to execute the asynchronous operations.

    async handleParallelExecution() {
        try {
            // Fetch accounts and contacts concurrently
            const [accounts, contacts] = await Promise.all([allAcc(), allContacts()]);

            // Process accounts data
            console.log('Accounts fetched successfully: ' + JSON.stringify(accounts));
            // Perform actions with accounts data

            // Process contacts data
            console.log('Contacts fetched successfully: ' + JSON.stringify(contacts));
            // Perform actions with contacts data
        } catch (error) {
            // Handle errors if any promise is rejected
            console.error('Error fetching data: ' + JSON.stringify(error));
        }
        finally {
            // Perform any actions needed in the finally block
        }
        console.log('Executed after All Promise\'s is resolved.');
    }


    renderedCallback() {
        //code
    }

}