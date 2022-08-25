// =====================================================================  *** MODEL SECTION ***  =====================================================================================





let details;

const savedDetails = JSON.parse(localStorage.getItem('details'));

if(Array.isArray(savedDetails)){
    details = savedDetails;
}
else{
    details = [0,0,0];
    // indexing represents: 0 - balance, 1 - inTotal, 2 - outTotal, 3 - inTotal2, 4 - outTotal2
}

let details2;

const previousSavedDetails = JSON.parse(localStorage.getItem('details2'));

if(Array.isArray(savedDetails)){
    details2 = previousSavedDetails;
}
else{
    details2 = [0,0];
    // indexing represents: 0 - balance, 1 - inTotal, 2 - outTotal, 3 - inTotal2, 4 - outTotal2
}

let allTransactions;

const savedTransactions = JSON.parse(localStorage.getItem('transactions'));

if(Array.isArray(savedTransactions)){
    allTransactions = savedTransactions;
}
else{
    allTransactions = [
        {
        item: "Mpesa profit",
        btnId: 4578758,
        amount: 20,
        date: "00 : 00 01/01/2000"},
        {
        item: "Mpesa profit",
        btnId: 5748758,
        amount: 20,
        date: "00 : 00 01/01/2000"},
        {
        item: "Mpesa profit",
        btnId: 45748758,
        amount: 20,
        date: "00 : 00 01/01/2000"}
    ];
}


// Creates a transaction
function createTransaction(input, description, type){

    // save the id as a string
    const id = "" + new Date().getTime();
    const transactionDate = trackTime();

    // saves the user inputs to the array
    allTransactions.push({
        item: description,
        amount: input,
        btnId: id,
        date: transactionDate,
        type: type
    });

    saveTransaction();
}

// removes a transaction
function removeTransaction(buttonId){

    allTransactions = allTransactions.filter(function(bidhaa){
        if(buttonId == bidhaa.btnId){
            return false;
        }
        else {
            return true;
        }
    })
    saveTransaction();
}

// save transactions
function saveTransaction(){
    localStorage.setItem('transactions', JSON.stringify(allTransactions))
}

// save details
function saveDetails(){
    localStorage.setItem('details', JSON.stringify(details));
    localStorage.setItem('details2', JSON.stringify(details2));
}

// ======================================================================= *** VIEWS SECTION  *** ======================================================================================


function renderTransactions(){

        // Clear all the transaction ready for updated transactions list
    document.getElementById('statements').innerHTML = '';

    if (allTransactions.length <= 0){
        const statementDiv = document.getElementById('statements');
        const transactionCard = document.createElement('div');
        transactionCard.setAttribute('class', 'transaction');
        transactionCard.setAttribute('id', 'no-transaction');
        transactionCard.innerText = "No transactions yet!!";
        statementDiv.appendChild(transactionCard);
    }
    else{
        document.getElementById('statements').innerHTML = '';
        allTransactions.forEach(function(stuff){
            // Transaction container div
           const transactionCard = document.createElement('div');
           transactionCard.setAttribute('class', 'transaction');
           if(stuff.type == "credit"){
               transactionCard.setAttribute('id', 'in');
           }
           else{
               transactionCard.setAttribute('id', 'out');
           }
   
           // add description span
           const descSpan = document.createElement('span');
           descSpan.setAttribute('class', 'item-stamp');
           descSpan.innerText = stuff.item;
           transactionCard.appendChild(descSpan);
   
           const timeSpan = document.createElement('span');
           timeSpan.setAttribute('class', 'time-stamp');
           timeSpan.innerHTML = stuff.date;
           transactionCard.appendChild(timeSpan);
   
           // add remove button
           const removeBtn = document.createElement('button');
           removeBtn.setAttribute('class', 'remove-button');
           removeBtn.innerHTML = "Refund";
           removeBtn.onclick = deleteTransaction;
           removeBtn.id = stuff.btnId;
           transactionCard.appendChild(removeBtn);
   
           // update the amount of the transaction
           const amount = document.createElement('span');
           amount.setAttribute('class', 'bold');
           amount.innerHTML = "$" + stuff.amount.toFixed(2);
           transactionCard.appendChild(amount);
   
           // get the statement div and append the created transaction card
           const statementDiv = document.getElementById('statements');
           statementDiv.insertBefore(transactionCard, statementDiv.firstChild);
       })
    }
}

// displays the balance
function updateBalance(){
    let currentBalance = document.getElementById('balance');
    currentBalance.innerHTML= "$" + details[0].toFixed(2);

    saveDetails();

}
// displays the totals for each transaction
function updateTotal(){
    let addTotal = document.getElementById('inTotal');
    let subTotal = document.getElementById('outTotal');
    addTotal.innerHTML = "$" + details[1].toFixed(2);
    subTotal.innerHTML = "$" + details[2].toFixed(2);

    saveDetails();
}

// ===================================================================  *** CONTROLLER SECTION  ***  ====================================================================================

// Adds a transaction
function addTransaction(type){
    
    // get the user inputs
    const input = parseFloat(document.getElementById('input').value);
    const description = document.getElementById('description').value;
    
    createTransaction(input, description, type);
    resetInputs();
    renderTransactions();
}

// deletes a transaction
function deleteTransaction(event){
    const removeButton = event.target;
    const buttonId = removeButton.id;
    refundTransaction(buttonId);
    removeTransaction(buttonId);    
    renderTransactions();
}

function creditAccount(){
    let input = parseFloat(document.getElementById('input').value);
    let description = document.getElementById('description').value;
    let type = "credit";

    details[0] += input;
    details[1] += input;

    details2[0] += input;

    if (input.value === "" || description === ""){
        alert("Input a valid amount or description");
    }
    else if (input.value == 0){
        alert("Input a minimum of one dollar")
    }
    else{
        updateBalance();
        updateTotal();
        addTransaction(type);
        saveDetails();
    }
   
}

function withdrawFunds(){

    let input = parseFloat(document.getElementById('input').value);
    let description = document.getElementById('description').value;
    let type = "debit";

    if(input > details[0]){
        alert("Insufficient balance. Please top up your account");
        resetInputs();
    }
    else{
        details[0] -= input;
        details[2] += input;

        details2[1] += input;

       
        if (input === "" || description ==""){
            alert("Input a valid amount or description");
        }
        else if (input.value == 0){
            alert("Input a minimum of one dollar");
        }
        else{
            updateBalance();
            updateTotal();
            addTransaction(type);
            saveDetails();
        }

        
    }
    
}

function refundTransaction(buttonId){
    let refundedTransaction = allTransactions.filter(function(bidhaa){
        if(buttonId == bidhaa.btnId){
            return true;
        }
        else {
            return false;
        }
    })

    if(refundedTransaction[0].type === 'credit'){
        details[1] -= refundedTransaction[0].amount;
        details[0] -= refundedTransaction[0].amount;

        details2[0] -= refundedTransaction[0].amount;
    }
    else{
        details[2] -= refundedTransaction[0].amount;
        details[0] += refundedTransaction[0].amount;

        details2[1] -= refundedTransaction[0].amount;
    }
    updateBalance();
    updateTotal();
    saveDetails();
}

function resetInputs(){
    // initialize the user input fields
    document.getElementById('input').value = "";
    document.getElementById('description').value = "";
}

function trackTime(){
    let time = new Date();
    let hour = time.getHours();
    let minute = time.getMinutes();
    let day = time.getDate();
    let months = time.getMonth();
    let year = time.getFullYear();
    let AMPM;

    if (hour > 12){
        hour = hour - 12;
        AMPM = "PM"
    }

    else {
        hour = hour;
        AMPM = "AM";
    }

    hour = hour >= 10 ? hour : "0" + hour;
    months = months >= 10 ? months : "0" + months;
    minute = minute >= 10 ? minute : "0" + minute;
    
    let month = parseFloat(months) + 1;
    return hour + " : " + minute + " " + AMPM + " " + day + "/0" + month + "/" + year;
}

function updatePreviousDetails(){
    let addTotal = document.getElementById('inTotal2');
    let subTotal = document.getElementById('outTotal2');

    addTotal.innerHTML = "$" + details2[0].toFixed(2);
    subTotal.innerHTML = "$" + details2[1].toFixed(2);
    
}

function resetDetails(){
    details[1] = 0;
    details[2] = 0;
    details[0] = 0;

    // details2[0] = 0;
    // details2[1] = 0;
    saveDetails();
    allTransactions = [];
    saveTransaction();

    document.location.reload();
}

// Monthly reset transaction function

function resetTransactions(){
    let time = new Date();
    let hour = time.getHours();
    let minute = time.getMinutes();
    let day = time.getDate();
    let seconds = time.getSeconds();

    if(hour == 00 && minute == 00 && day == 01 && seconds == 00){
        let addTotal = document.getElementById('inTotal2');
        let subTotal = document.getElementById('outTotal2');
        details[3] = details[1];
        details[4] = details[2];

        addTotal.innerHTML = "$" + details[3].toFixed(2);
        subTotal.innerHTML = "$" + details[4].toFixed(2);

        resetDetails();
    }
}

// resetDetails();
updateTotal();
updateBalance();
renderTransactions();
updatePreviousDetails()

// resets your data every endmonth
// resetTransactions();
