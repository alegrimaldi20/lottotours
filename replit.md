# BookEasy Appointment Booking System

## Overview

BookEasy is a modern appointment booking web application built with React and Express. The system allows users to view services, book appointments online, leave reviews, and contact the business. It features a clean, responsive design with a blue color scheme and provides both client-facing and administrative functionality for managing appointments and customer interactions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on top of Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation for type-safe form handling

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Storage**: In-memory storage implementation (MemStorage) with interface for future database integration
- **API Design**: RESTful API with JSON responses and proper error handling
- **Validation**: Zod schemas shared between client and server for consistent validation

### Data Storage Solutions
- **ORM**: Drizzle ORM configured for PostgreSQL with schema-first approach
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Schema Management**: Centralized schema definitions in shared directory with automatic TypeScript type generation
- **Migration System**: Drizzle Kit for database migrations and schema synchronization

### Authentication and Authorization
- **Current State**: No authentication system implemented
- **Session Management**: Express sessions configured with PostgreSQL session store (connect-pg-simple)
- **Security**: Basic CORS and request parsing middleware in place for future authentication integration

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL database hosting
- **Connection**: Uses `@neondatabase/serverless` driver for database connectivity

### UI and Component Libraries
- **Shadcn/ui**: Complete UI component system with customizable design tokens
- **Radix UI**: Unstyled, accessible UI primitives for complex components
- **Lucide React**: Icon library for consistent iconography
- **Tailwind CSS**: Utility-first CSS framework for styling

### Development and Build Tools
- **Vite**: Frontend build tool with React plugin and development server
- **TypeScript**: Type safety across the entire application
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS and Autoprefixer

### Form and Validation Libraries
- **React Hook Form**: Performance-focused forms with minimal re-renders
- **Zod**: Runtime type validation and schema definition
- **Hookform Resolvers**: Integration between React Hook Form and Zod

### Date and Time Handling
- **date-fns**: Lightweight date manipulation and formatting library

### Development Environment
- **Replit Integration**: Special handling for Replit development environment with custom plugins and error overlays
- **Hot Module Replacement**: Vite HMR for fast development iteration