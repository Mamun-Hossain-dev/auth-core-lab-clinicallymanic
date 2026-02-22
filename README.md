# Node Express Modular Starter

A **production-ready, modular, and reusable Node.js Express starter** for building scalable backend and SaaS applications.  
Built with **TypeScript**, **Clean Architecture**, and **industry best practices**.

---

## 🚀 Features

- **Modular Architecture**  
  Feature-based modules (Controller, Service, Model, Validation, Interface, Routes).

- **Authentication & Authorization**  
  Secure JWT-based auth (Access & Refresh Tokens) with role-based access control.

- **Strict Validation**  
  End-to-end request validation using **Zod** (body, query, params).

- **Centralized Error Handling**  
  Global error handler for Zod, Mongoose, and custom App errors.

- **Security First**  
  Helmet, Rate Limiting, CORS configuration, and secure cookies.

- **Database Best Practices**  
  Mongoose with clean schema design, indexing, and connection handling.

- **File Upload Support**  
  Multer + Cloudinary integration for secure media uploads.

- **Logging**  
  Production-ready logging using **Winston**.

- **Email & OTP Utilities**  
  Built-in helpers for email sending and OTP workflows.

- **Great Developer Experience**  
  ESLint, Prettier, TypeScript types, and clean project structure.

---

## 📂 Project Structure

````txt
src/
├── config/             # Environment configuration (Zod validated)
├── errors/             # Custom error classes & handlers
├── interface/          # Shared interfaces & types
├── middlewares/        # Auth, validation, error handlers
├── modules/            # Feature modules (Auth, User, etc.)
│   ├── auth/
│   └── user/
├── routes/             # Centralized router
├── utils/              # Shared utilities (JWT, Logger, Mail, etc.)
├── app.ts              # Express app setup
└── server.ts           # Entry point


## 🛠️ Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Mamun-Hossain-dev/node-express-modular-starter
   cd node-express-modular-starter
````

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Copy `.env.example` to `.env` and fill in the required values.

   ```bash
   cp .env.example .env
   ```

   **Required Variables:**
   - `MONGO_URI`: Your MongoDB connection string.
   - `ACCESS_TOKEN_SECRET` / `REFRESH_TOKEN_SECRET`: Secrets for JWT.
   - `CLOUDINARY_*`: Cloudinary credentials for file uploads.

4. **Run the server:**
   ```bash
   npm run dev
   ```

## 📜 Scripts

- `npm run dev`: Start development server with hot-reload.
- `npm run build`: Compile TypeScript to JavaScript.
- `npm start`: Start the production server (after build).
- `npm run lint`: Run ESLint.
- `npm run lint:fix`: Fix linting errors.
- `npm run format`: Format code with Prettier.

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## 📄 License

This project is licensed under the ISC License.

<!-- NODE_ENV=<development_or_production>
PORT=<your_port>

MONGO_URI=<your_mongodb_connection_string>

CLIENT_URL=<your_frontend_url>

BCRYPT_SALT_ROUNDS=<number_of_salt_rounds>

ACCESS_TOKEN_SECRET=<your_access_token_secret>
REFRESH_TOKEN_SECRET=<your_refresh_token_secret>

ACCESS_TOKEN_EXPIRES_IN=<access_token_expiry_time>
REFRESH_TOKEN_EXPIRES_IN=<refresh_token_expiry_time>

RESET_PASS_UI_LINK=<your_reset_password_frontend_link>

EMAIL_FROM=<sender_email_address>
EMAIL_USER=<smtp_email_username>
EMAIL_PASS=<smtp_email_password_or_app_password>
EMAIL_PORT=<smtp_port>
EMAIL_HOST=<smtp_host>

CLOUDINARY_CLOUD_NAME=<cloudinary_cloud_name>
CLOUDINARY_API_KEY=<cloudinary_api_key>
CLOUDINARY_API_SECRET=<cloudinary_api_secret>

RATE_LIMIT_WINDOW=<rate_limit_window_in_ms>
RATE_LIMIT_MAX=<max_requests_per_window>

COOKIE_SECRET=<your_cookie_secret>
 -->
