#Expense Tracker- Phase 0

Phase 0 covers thr basic concepts and practical setup required for the Expense Tracker project.

## Task 1 - Fetch & Bootstrap

- Used 'fetch()' to get users from JSONPlaceholder API.
- Used 'async/await' and 'try/catch' for asynchronous operation and error handling.
- Checked 'response.ok' and handled failed requests.
- Used Bootstrap for styling and responsive cards.
- Created user cards dynamically using JavaScript DOM.
- Displayed user name, email, city, and company.
- Added a loading spinner while fetching data.
- Added a Bootstrap alert when the request fails.

## Task 2 - Node.js & Express

- Create a Node.js project using Express.
- Bulit REST API endpoint:
    - 'GET/api/hello'.
    - 'Get/api/expenses'.
- Tested API endpoints using the browser and Thunder Client.
- Tested invalid routes and '404' response.
- Configures CORS to allow frontend request.

## Task 3 - postgreSQL

- Created a postgreSQL database and 'students' table.
- Connected Node.js to postgreSQL using 'pg' and 'Pool'.
- Used 'dotenv' for database configuration.
- Created an endpoint to retrive all students.
- Created an endpoint to retrive student by ID.
- Used parameterzied quiers with '$1'.
- Handled students that dose not exist with '404'.
- Added validation for invalid student IDs.

## Technologies 

- HTML
- JavaScript
- Node.js
- Express.js
- CORS
- PostgreSQL
- pg
- dotenv

