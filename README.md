
# Invoice Service

An Invoice Management System built with **NestJS**, **MongoDB**, and **RabbitMQ**. The system provides RESTful APIs for managing invoices, generates daily sales summaries, and sends reports via RabbitMQ for email notifications.

---

## Features

- **Invoice Management**:
  - Create, view, and list invoices with detailed item information.
  - Filter invoices by date range.
  
- **Daily Sales Summary**:
  - Automatic generation of sales summaries via a scheduled cron job.
  - Calculates total sales and item quantities grouped by SKU.
  
- **RabbitMQ Integration**:
  - Publishes daily sales summaries to a RabbitMQ queue.
  - Processes sales summaries via a consumer to send email notifications.

- **Email Notifications**:
  - Sends sales summary reports via email (mocked or real).

- **Testing**:
  - Unit and integration tests for critical components.
  - Comprehensive test coverage for API endpoints and services.

---

## Technologies Used

- **Backend Framework**: [NestJS](https://nestjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/)
- **Message Queue**: [RabbitMQ](https://www.rabbitmq.com/)
- **Email Service**: Mocked or [SendGrid](https://sendgrid.com/) (optional)
- **Testing**: [Jest](https://jestjs.io/)

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Docker](https://www.docker.com/) (for RabbitMQ and MongoDB)
- [MongoDB](https://www.mongodb.com/) (local or hosted)
- RabbitMQ instance (local or hosted)

---

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/invoice-service.git
   cd invoice-service
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the root directory and configure the following:
   ```dotenv
   MONGO_URI=mongodb://localhost:27017/invoice-service
   RABBITMQ_URL=amqp://localhost
   RABBITMQ_QUEUE=daily_sales_report
   RECIPIENT_EMAIL=recipient@example.com
   SENDGRID_API_KEY=your-sendgrid-api-key
   ```

4. **Run MongoDB and RabbitMQ**:
   Use Docker to run MongoDB and RabbitMQ:
   ```bash
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   docker run -d --hostname my-rabbit --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
   ```

5. **Start the application**:
   ```bash
   docker build -t invoice-service .
   ```
     ```bash
   docker-compose up --build
   ```

---

## API Documentation

### Base URL
```
http://localhost:3000
```

### Endpoints

#### Invoices
- **POST /invoices**: Create a new invoice.
  - Request Body:
    ```json
    {
      "customer": "John Doe",
      "amount": 150,
      "reference": "INV12345",
      "items": [
        { "sku": "ITEM001", "qt": 2 },
        { "sku": "ITEM002", "qt": 3 }
      ]
    }
    ```

- **GET /invoices/:id**: Retrieve an invoice by ID.

- **GET /invoices**: List all invoices (with optional date range filters).
  - Query Parameters:
    - `startDate` (optional)
    - `endDate` (optional)

---

## RabbitMQ Integration

1. **Producer**:
   - Publishes daily sales summaries to the `daily_sales_report` queue.
   - Triggered daily at `12:00 PM` via a cron job.

2. **Consumer**:
   - Listens to the `daily_sales_report` queue.
   - Processes the sales summary and sends email notifications.

---

## Email Notifications

- **Email Service**:
  - Mocked email notifications are sent during development.
  - To use SendGrid or another service, configure the `SENDGRID_API_KEY` in the `.env` file.

---

## Testing

Run unit and integration tests:
```bash
npm run test
```

Run test coverage:
```bash
npm run test:cov
```

---

## Project Structure

```plaintext
src/
├── app.module.ts               # Main application module
├── modules/
│   ├── invoices/               # Invoice management
│   │   ├── invoice.module.ts
│   │   ├── invoice.controller.ts
│   │   ├── invoice.service.ts
│   │   ├── sales-summary.cron.ts
│   │   ├── email.service.ts
│   │   └── ...
│   ├── email-consumer/         # RabbitMQ consumer for email notifications
│   │   ├── email-consumer.module.ts
│   │   ├── email-consumer.service.ts
│   │   ├── email-consumer.controller.ts
│   │   └── ...
├── schemas/                    # Mongoose schemas
│   ├── invoice.schema.ts
└── main.ts                     # Application entry point
```

---

