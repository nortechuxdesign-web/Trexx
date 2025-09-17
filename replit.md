# Overview

This is a full-stack web application for generating custom artwork designs. The system allows users to create marketing materials by providing company information, selecting colors, choosing mission types, and uploading logos. The application generates canvas-based artwork that can be downloaded as images.

The project is built as a modern web application with a React frontend and Express backend, designed for creating professional-looking graphics for social media campaigns and promotional materials.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend is built with **React** and **TypeScript**, using **Vite** as the build tool. The UI leverages **shadcn/ui** component library for consistent design patterns, built on top of **Radix UI** primitives and styled with **Tailwind CSS**.

**Key architectural decisions:**
- **Component-based architecture**: Modular React components for reusability
- **Form management**: React Hook Form with Zod validation for type-safe form handling
- **State management**: TanStack Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Canvas rendering**: HTML5 Canvas API for dynamic artwork generation
- **File uploads**: Native File API with drag-and-drop support

The frontend follows a clean separation of concerns with dedicated directories for components, pages, hooks, and utilities.

## Backend Architecture

The backend uses **Express.js** with **TypeScript** in ESM module format. The server implements a RESTful API design pattern with proper middleware setup for request logging, error handling, and file uploads.

**Key architectural decisions:**
- **Storage abstraction**: Interface-based storage layer supporting both in-memory and database implementations
- **File handling**: Multer middleware for file uploads with validation and Sharp for image processing
- **API structure**: Organized route handlers with proper separation of concerns
- **Development tooling**: Custom Vite integration for hot reloading in development

## Data Storage Solutions

The application uses **Drizzle ORM** with **PostgreSQL** as the primary database solution. The system is configured to work with **Neon Database** for cloud hosting.

**Database schema includes:**
- **Users table**: Authentication and user management
- **Artworks table**: Generated artwork metadata and file paths
- **JSON metadata**: Flexible data storage for artwork configuration

**Storage strategy:**
- Database stores metadata and file references
- File system stores uploaded logos and generated artwork
- In-memory fallback implementation for development/testing

## Authentication and Authorization

The system uses session-based authentication with **connect-pg-simple** for PostgreSQL session storage. This provides secure user sessions without requiring complex JWT token management.

## Canvas Generation System

The core artwork generation uses HTML5 Canvas API to dynamically create graphics based on user input:

**Design patterns:**
- Template-based rendering system
- Color scheme application
- Logo integration with proper scaling
- Text rendering with custom fonts
- Export functionality for high-quality downloads

# External Dependencies

## Third-party Services
- **Neon Database**: PostgreSQL hosting service for production database
- **Replit**: Development environment with integrated hosting

## Key Libraries and Frameworks
- **React ecosystem**: React, React DOM, React Hook Form
- **UI components**: Radix UI primitives, shadcn/ui component library
- **Styling**: Tailwind CSS for utility-first styling
- **Backend**: Express.js, Multer for file uploads, Sharp for image processing
- **Database**: Drizzle ORM, PostgreSQL driver (@neondatabase/serverless)
- **Validation**: Zod for schema validation
- **Build tools**: Vite for frontend bundling, esbuild for backend compilation
- **Development**: TypeScript, tsx for development server

## File Processing
- **Sharp**: Server-side image processing and validation
- **Multer**: File upload handling with size and type restrictions

## Development Tools
- **Vite plugins**: Runtime error overlay, development banner for Replit integration
- **PostCSS**: CSS processing with Tailwind CSS integration