// Expense Tracker - frontend logic
// PHASE 2
// Your backend from Phase 1 is already running, with real expenses in the
// database (from schema.sql). Build this page directly against it with
// fetch and async/await - there is no in-memory or localStorage stage
// this time, and no sample data file.
//
// A possible structure (change it if you have a better idea):
//   - async function getExpenses()          fetch(API_URL), return the JSON
//   - async function addExpense(data)       fetch(API_URL, { method: "POST", ... })
//   - async function updateExpense(id,data) fetch(API_URL + "/" + id, { method: "PUT", ... })
//   - async function deleteExpense(id)      fetch(API_URL + "/" + id, { method: "DELETE" })
//   - async function refresh()              get the list, then call renderTable and renderSummary
//   - renderTable(list)                     build the table rows from the array the API returned
//   - renderSummary(list)                   update the summary cards
//   - applyFilter()                         re-render with the list filtered by category
//
// Don't forget:
//   - Show a Bootstrap spinner while a request is in flight.
//   - Wrap every fetch call in try/catch, and show a Bootstrap alert on failure.
//   - After add, edit, or delete, call refresh() so the page always shows
//     what the server actually saved - never update the table by hand.
//   - The API is at http://localhost:3000/api/expenses (see the Roadmap).






const API_URL = "http://localhost:3000/api/expenses";

let allExpenses = [];

let editingExpenseId = null;

const darkModeButton = document.getElementById("darkModeButton");
darkModeButton.addEventListener("click", function(){
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
});

const savedDarkMode = localStorage.getItem("darkMode");
if (savedDarkMode === "true")
{
    document.body.classList.add("dark-mode");
}

function showFloatingAlert(message, type)
{
    const container = document.getElementById("floatingAlertContainer");
    container.innerHTML="";
    const alert = document.createElement("div");
    alert.className = `alert floating-alert alert-${type}`;
    alert.textContent = message;

    container.appendChild(alert);

    setTimeout(()=>{
            alert.classList.add("hide");
        }, 4000);
}

const saveEditButton = document.getElementById("saveEditButton");
saveEditButton.addEventListener("click", async function(){
    try{
    const title = document.getElementById("editTitle").value;
    const amount = document.getElementById("editAmount").value;
    if (amount ==="")
        {
            showFloatingAlert("Missing required fields", "danger");
            return;
        }
    const category = document.getElementById("editCategory").value;
    const dateValue = document.getElementById("editDate").value;

    const expenseData = {
        title: title,
        amount: amount,
        category: category,
        date: dateValue
    };

    const response = await fetch (`${API_URL}/${editingExpenseId}`,{
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(expenseData)
    });
    const data = await response.json();
    if (!response.ok)
    {
        showFloatingAlert(data.message, "danger");
    }
    else
    {
    showFloatingAlert("Expense updated successfully", "success");

    const editModal = bootstrap.Modal.getInstance(document.getElementById("editModal"));
    editModal.hide();   
    await refresh(); 
    }   
}
catch(error)
{
    showFloatingAlert("Unable to connect to the server", "danger");

    const editModal = bootstrap.Modal.getInstance(document.getElementById("editModal"));
    editModal.hide(); 
}
  
});

function filterExpenses()
{
    const searchText = titleSearch.value.toLowerCase();
    const selectedCategory = categoryFilter.value;
    const searchResult = allExpenses.filter(expense =>{
        return expense.title.toLowerCase().includes(searchText)
        && (selectedCategory ==="All" || expense.category === selectedCategory);
        
    });
    insertTable(searchResult);
}
const titleSearch = document.getElementById("titleSearch");
titleSearch.addEventListener("input", function(){
   filterExpenses();
});

const categoryFilter = document.getElementById("categoryFilter");
categoryFilter.addEventListener("change", function(){
    filterExpenses();
});

const alertContainer = document.getElementById("alertContainer");

const expenseForm = document.getElementById("expenseForm");
expenseForm.addEventListener("submit", async function(event){
    event.preventDefault();
    alertContainer.innerHTML= "";
    const title = document.getElementById("title").value;
    const amount = Number(document.getElementById("amount").value);
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;

    const expenseData = {
        title: title,
        amount: amount,
        category: category,
        date: date
    };
    try
    {
    const response = await fetch(API_URL, {
        method: "POST",
        headers :{
            "content-type": "application/json"
        },
        body: JSON.stringify(expenseData)
    });
    const data = await response.json();
    if (!response.ok)
    {
        const alert = document.createElement("div");
        alert.className = "alert alert-danger";
        alert.textContent = data.message;
        alertContainer.appendChild(alert);

        setTimeout(()=>{
            alert.remove();
        }, 4000);
    }
    else
    {
        const alert = document.createElement("div");
        alert.className = "alert alert-success";
        alert.textContent = "expense added successfully";
        alertContainer.appendChild(alert);

        setTimeout(()=>{
            alert.remove();
        }, 4000);

        expenseForm.reset();
        await refresh();

    }
    }
    catch(error)
    {
        const alert = document.createElement("div");
        alert.className = "alert alert-danger";
        alert.textContent = "unable to connect to the server";
        alertContainer.appendChild(alert);

        setTimeout(()=>{
            alert.remove();
        }, 4000);
    }
});

async function getExpenses() {
    try
    {
        document.getElementById("loadingSpinner").style.display = "block";
        const response = await fetch(API_URL);
        const data = await response.json();
        document.getElementById("loadingSpinner").style.display = "none";
        return data;
    }
    catch(error)
    {
        document.getElementById("loadingSpinner").style.display = "none";
        const alert = document.createElement("div");
        alert.className = "alert alert-danger";
        alert.textContent = "unable to connect to the server";
        alertContainer.appendChild(alert);

        setTimeout(()=>{
            alert.remove();
        }, 4000);
    }
}

async function refresh() {
    const data= await getExpenses();
    allExpenses = data;
    
    filterExpenses();
    renderSummary(data);
}

function insertTable(list)
{
    const tbody = document.getElementById("expenseTableBody");
    tbody.innerHTML = "";
    list.forEach(expense =>{
        const row = document.createElement("tr");

        const titleCell = document.createElement("td");
        titleCell.textContent = expense.title;
        row.appendChild(titleCell);

        const amountCell = document.createElement("td");
        amountCell.textContent = expense.amount;
        row.appendChild(amountCell);

        const categoryCell = document.createElement("td");
        const categoryBadge= document.createElement("span");
        categoryBadge.textContent = expense.category;
        if(expense.category === "Food")
        {
            categoryBadge.className = "badge bg-success";
        }
        else if (expense.category === "Transport")
        {
            categoryBadge.className = "badge bg-primary";
        }
        else if (expense.category === "Bills")
        {
            categoryBadge.className = "badge bg-warning text-dark";
        }
        else if (expense.category === "Entertainment")
        {
            categoryBadge.className = "badge bg-info text-dark";
        }
        else if (expense.category === "Other")
        {
            categoryBadge.className = "badge bg-secondary ";
        }

        categoryCell.appendChild(categoryBadge);
        row.appendChild(categoryCell);

        const dateCell = document.createElement("td");
        dateCell.className = "text-nowrap";
        dateCell.textContent = expense.date;
        row.appendChild(dateCell);

        const actionCell = document.createElement("td");
        actionCell.className = "text-end text-nowrap";
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "btn-sm btn me-2 action-btn editBtn";
        actionCell.appendChild(editButton);
        editButton.addEventListener("click", function(){
            editingExpenseId = expense.id;
            
            const editModal = new bootstrap.Modal(document.getElementById("editModal"));
            document.getElementById("editTitle").value = expense.title;
            document.getElementById("editAmount").value = expense.amount;
            document.getElementById("editCategory").value = expense.category;
            
            const dateParts = expense.date.split("-");
            document.getElementById("editDate").value = dateParts[2]+"-"+dateParts[1]+"-"+dateParts[0];

            editModal.show();
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "btn-sm btn btn-danger action-btn ";
        actionCell.appendChild(deleteButton);
        deleteButton.addEventListener("click", async function(){
            try
            {
            const response = await fetch(`${API_URL}/${expense.id}`,{
                method: "DELETE"
            });
            const data = await response.json();
            if(!response.ok)
            {
            showFloatingAlert(data.message, "danger");
            }
            else
            {
            showFloatingAlert("expense deleted successfully", "success");
            await refresh();

            }
        }
        catch(error)
        {
            showFloatingAlert("Unable to connect to the server", "danger");
        }
        });

        row.appendChild(actionCell);

        tbody.appendChild(row);

    });
}

function renderSummary(list)
{
    let total = 0;
    list.forEach(expense =>{
        total +=expense.amount;
    });
    const totalElement = document.getElementById("total");
    totalElement .textContent = "$"+ total;

    const numberOfExpense = list.length;
    const numberElement = document.getElementById("numberOfExpenses");
    numberElement.textContent = numberOfExpense;

    let highest = 0;
    list.forEach(expense =>{
        if(expense.amount > highest)
        {
            highest= expense.amount;
        }
    });
    const highestElement = document.getElementById("highestExpense");
    highestElement.textContent = "$" + highest;

}
getExpenses().then(data =>{
     allExpenses = data;
     insertTable(data);
     renderSummary(data);
});
