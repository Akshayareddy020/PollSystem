# PollSystem
PollSystem is a web-based interactive application that seeks to promote classroom interaction using live polls. Built using React.js on the client side and Python Flask on the server side, PollSystem allows teachers to create, administer, and monitor polls while enabling students to respond with ease.

Project Setup Instructions
Frontend Setup
•	All frontend files (HTML, CSS, JavaScript) are placed inside the templates/ and static/ folders.
•	Styling is done using plain CSS with responsive designs and intuitive layouts.
•	Chart.js is used for pie charts.
•	FontAwesome icons are used for buttons and sidebar navigation.
Backend Setup
•	The application backend is developed using Flask (Python).
•	Flask Blueprints are used for modularizing the routes (auth routes, poll routes, and graph routes).
Database Setup
•	The project uses MySQL database.
•	Tables required for the application (users, polls, poll_options, responses) are created using the provided setup.sql file.
•	The database configuration is handled in db_config.py file.
How the system works
1.	Users register or login via the Home Page.
2.	Based on the role (teacher/student), users are redirected to their respective dashboards.
3.	Teachers can create polls with multiple options.
4.	Students can view available polls and submit their votes.
5.	Students can also view the list of polls they have answered.
6.	Teachers can view detailed results and delete unwanted polls.
Required Files
•	setup.sql — Contains database table creation commands.
•	db_config.py — Connects the application to the MySQL database.
•	app.py — Main server file to run the application.
•	routes/ — Contains separate route files for authentication, poll management, and graphs.
•	static/ — CSS and JavaScript files for frontend functionality and styling.
•	templates/ — HTML templates for different pages (login, register, teacher dashboard, student dashboard).
Database Tables
•	users — Stores user credentials and role (teacher/student).
•	polls — Stores poll questions created by teachers.
•	poll_options — Stores options associated with polls.
•	responses — Stores the responses submitted by students.

