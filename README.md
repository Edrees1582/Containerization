# Containerization

A containerized microservices data collection and analytics system.

* Enter data (web app) is used to collect data (temperatures). <br>
* Users are allowed to enter data after validating their credentials through the Authentication Service. Any entered data will be written to MySql DB service. <br>
* Show results (web app) is used to present simple analytics (max, min, average). <br>
* Users are allowed to see the analytics after validating their credentials through the Authentication Service. The Show Results service reads data from Mongo DB service. <br>
* The Authentication Services is a simple service to validate users credentials. <br>
* The Analytics Service reads data from MySql DB service, gets simple statistics like Max, Min, Avg. and writes that to Mongo DB Service.

### Login page
![Login page](https://i.ibb.co/K5TC3T5/Screenshot-11.png)

### Enter data page
![Enter data page](https://i.ibb.co/k1tr3YN/Screenshot-12.png)

### Get analytics page
![Get analytics page](https://i.ibb.co/Dzhrktw/Screenshot-13.png)

### Show analytics results page
![Show analytics results page](https://i.ibb.co/qY7MhR0/Screenshot-14.png)
