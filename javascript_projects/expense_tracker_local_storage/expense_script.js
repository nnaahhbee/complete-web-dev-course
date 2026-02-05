document.addEventListener('DOMContentLoaded', () => {

    // Get references to DOM elements
    const expenseForm = document.getElementById('expense-form');
    const expenseNameInput = document.getElementById('expense-name');
    const expenseAmountInput = document.getElementById('expense-amount');
    const expenseList = document.getElementById('expense-list');
    const totalAmountDisplay = document.getElementById('total-amount');


    // Initialize expenses from local storage or start with an empty array
   let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

   let totalAmount = calculateTotal();

   renderExpenses();


   // Event listener for form submission to add a new expense
   expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = expenseNameInput.value.trim();
    const amount = parseFloat(expenseAmountInput.value.trim());

    if(name !== "" && !isNaN(amount) && amount > 0){
        const newExpense = {
            id: Date.now(),
            name: name,
            amount: amount,
        }
        expenses.push(newExpense);
        saveExpensesToLocal();
        renderExpenses();
        updateTotal();

        //clear inputs
        expenseNameInput.value = "";
        expenseAmountInput.value = "";

    }
   });


   // Function to render expenses in the list
   function renderExpenses() {
    expenseList.innerHTML = "";
    expenses.forEach(expense => {
       const li = document.createElement('li');
       li.innerHTML = `
         ${expense.name} - $${expense.amount} <button data-id = "${expense.id}">Delete</button>
       `;
        expenseList.appendChild(li);
    });
   }
   

   // Function to calculate the total amount of expenses
   function calculateTotal() {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
   }


   // Function to save expenses to local storage
   function saveExpensesToLocal() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
   }


   // Function to update the total amount display
   function updateTotal(){
    totalAmount = calculateTotal();
    totalAmountDisplay.textContent = totalAmount.toFixed(2);
   }


   // Event listener for deleting an expense
   expenseList.addEventListener('click', (e) => {
    if(e.target.tagName === 'BUTTON'){
       const expenseId = (e.target.getAttribute('data-id'));
       expenses = expenses.filter(expense => expense.id !== expenseId);

       saveExpensesToLocal();
       renderExpenses();
       updateTotal();
    }

   });
});