# 🛡️ Authentication Microservice

Welcome to the **Authentication Microservice** of our CVDS (Ciclos de Vida del Desarrollo de Software) project! This service provides secure authentication and user management functionalities, acting as a cornerstone for our system's user interaction and data security. 🚀

## ✨ Description
This microservice handles:
- **User Authentication**: Login, logout, and session management using JWT tokens.
- **User Management**: User registration and role-based permissions.
- **Security**: Secure password hashing with Argon2.

Built with a modern tech stack to ensure reliability, scalability, and ease of maintenance.

## 👤 Dev Team
- **Tomas Felipe Panqueva**
- **Juan Pablo Camargo**
- **Juan Sebastian Buitrago Piñeros**
- **Juan Esteban Medina Rivas**

## 🛠️ Tech Stack
- **Language**: [Node.js](https://nodejs.org/)  
- **Package Manager**: [PNPM](https://pnpm.io/)  
- **Framework**: [NestJS](https://nestjs.com/)  
- **Database**: [PostgreSQL](https://www.postgresql.org/)  
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)  
- **Validation**: [Zod](https://zod.dev/)  
- **Password Hashing**: [Argon2](https://github.com/P-H-C/phc-winner-argon2)  
- **Deployment**: [Docker](https://www.docker.com/)
- **Documentation**: [Swagger](https://swagger.io/)

## 📚 API Documentation
For detailed information about the API endpoints, refer to the [API Documentation](./API.md).  

Additionally, when running the project, you can explore the following Swagger resources:
- **Interactive Swagger UI**: Navigate to [`localhost:<PORT>/api`](http://localhost:<PORT>/api).  
- **Swagger JSON**: Access the raw Swagger JSON at [`localhost:<PORT>/api-json`](http://localhost:<PORT>/api-json).  
- **Swagger YAML**: Access the raw Swagger YAML at [`localhost:<PORT>/api-yml`](http://localhost:<PORT>/api-yml).  

## 🖥️ Development Environment
To set up and run this microservice locally:

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Configure the environment variables**:
   - Rename `.env.example` to `.env`.
   - Fill in the necessary environment variables (e.g., database URL, JWT secret, etc.).

3. **Install dependencies**:
   ```bash
   pnpm install
   ```

4. **Run the development server**:
   ```bash
   pnpm start:dev
   ```

That's it! The microservice should now be running on `http://localhost:<PORT>`.

## 🔒 Contribution
This repository is **private**. Contributions are restricted to group members.  
External pull requests will not be accepted.  

## 📋 Issues
All pertinent issues must be logged directly in the **GitHub Issues** section of this repository. Please ensure detailed descriptions and appropriate labels when creating an issue.  

## 💡 Notes
- Always ensure your `.env` file is updated before running the service.  
- Check the tech stack documentation for additional insights or troubleshooting tips.

Thank you for using and supporting this microservice! 🛡️
