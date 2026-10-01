async function getUsers() {
const spinner = document.getElementById("spinner");

    try
    {
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        if (!response.ok)
        {
            throw new Error("request failed");
        }

        const users = await response.json();
        const cardContainer = document.getElementById("cardsContainer");
        spinner.style.display = "none";
        

        users.forEach(function(user)
        {
            const card =document.createElement("div");
            card.className = "col-md-4 mb-4";
            //console.log(card);

            const cardContent = document.createElement("div");
            cardContent.className = "card";

            const cardBody = document.createElement("div");
            cardBody.className = "card-body";

            const cardTitle = document.createElement("h5");
            cardTitle.className = "card-title";
            cardTitle.textContent = user.name;

            const email = document.createElement("p");
            email.className = "card-text";
            email.textContent = user.email ;

            const city = document.createElement("p");
            city.className = "card-text";
            city.textContent =user.address.city;

            const company = document.createElement("p");
            company.className = "card-text";
            company.textContent= user.company.name;

            cardBody.appendChild(cardTitle);
            cardBody.appendChild(email);
            cardBody.appendChild(city);
            cardBody.appendChild(company);

            cardContent.appendChild(cardBody);
            card.appendChild(cardContent);

            cardContainer.appendChild(card);

            

        });
    }
    catch(error)
    {
        spinner.style.display = "none";

        const alertContainer = document.getElementById("alertContainer");
        const alert = document.createElement("div");
        alert.className = "alert alert-danger";
        alert.textContent = "failed to load users!";
        alertContainer.appendChild(alert);
        
        console.log(error);
    }
}

getUsers();