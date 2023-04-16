# <img src="https://raw.githubusercontent.com/CS555-Team09-MagicDot/magicdot-solar/main/public/img/logo.svg" alt="magicdot solar logo" height="32"> Magicdot Solar

Magicdot Solar is a solar energy solutions company that provides a range of products and services to help businesses and homeowners reduce their carbon footprint while saving on energy costs. This repository contains the source code for our website, which provides customers with information about our company and allows them to submit inquiries. Additionally, it includes dashboards for employees with different roles, as well as customers.

### Technologies Used:

- Node.js
- Express.js
- Express-Handlebars
- MongoDB
- Tailwind CSS

## Getting Started

### Prerequisites:

To run this project, you will need to have [Node.js](https://nodejs.org/en/download) and [MongoDB server](https://www.mongodb.com/try/download/community) installed on your system.

### Installation:

#### Clone the repository

```shell
git clone https://github.com/CS555-Team09-MagicDot/magicdot-solar.git
```

#### Install the dependencies

```shell
npm install
```

#### Populate the database

```shell
npm run seed
```

**Test accounts:** (Only valid if you run seed)

- Customer:
  - Email: customer@gmail.com
  - Password: Test@123
- Sales Representative:
  - Email: sales@gmail.com
  - Password: Test@123
- Operational Manager:
  - Email: operations@gmail.com
  - Password: Test@123
- Onsite Team Member:
  - Email: onsite@gmail.com
  - Password: Test@123

#### Start the server

```shell
npm start
```

### Run tests:

To run the tests use the following command:

```shell
npm test
```

**Open your browser and navigate to** http://localhost:3000

## Features

#### Landing Page

The landing page provides an overview of our company and its services. It includes a contact form that customers can use to submit inquiries.

#### Dashboards

The website provides dashboards for employees with different roles, as well as customers. Each dashboard includes relevant information and features for the specific user.

- **Sales Dashboard:** Provides sales representatives with a view of their leads and deals, as well as the ability to add new leads and update existing ones.
- **Operational Managers Dashboard:** Provides operational managers with a view of ongoing projects and the ability to assign tasks to on-site team members.
- **On-Site Team Members Dashboard:** Provides on-site team members with a view of their tasks and the ability to update their status.
- **IT Admin Dashboard:** Provides IT administrators with a view of system logs and the ability to manage user accounts.
- **Customer Dashboard:** Provides customers with a view of their projects and the ability to talk to sales representatives and view the status of their ongoing projects.

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/CS555-Team09-MagicDot/magicdot-solar/blob/main/LICENSE) file for more information.
