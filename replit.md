# TravelLotto DApp - Blockchain Tourism Lottery Platform

## Overview

TravelLotto is a gamified blockchain-based DApp that combines digital lotteries with authentic travel experiences. Users participate in themed missions, lotteries, and challenges to earn tokens and NFTs that can be redeemed for real travel packages, exclusive experiences, and tourism benefits. The platform features modern Web3 integration, vibrant lottery and tourism-themed UI with eye-catching colors, detailed travel imagery, and transparent blockchain mechanics for international tourism.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (August 2025)

**Extraordinary Gaming UX Implementation (August 2025)**
- **NEW**: Implemented comprehensive age verification modal with responsible gaming warnings
- Added full sound system with Howler.js for click, success, lottery, and win sound effects
- Created animated button components with glow effects, sparkles, and premium gaming aesthetics
- Built floating particle system with gold and colorful particles for immersive background
- Implemented confetti celebration system for mission completions and achievements
- Added animated lottery number selector with quick pick functionality and visual feedback
- Integrated sound toggle control for user preference management
- Enhanced dashboard with celebration animations and premium gaming visual effects

**Critical Web3 Integration Fix (August 2025)**
- **FIXED**: Identified root cause of Spanish locale DOM manipulation error - app was missing blockchain integration
- Added comprehensive Web3 integration with ethers.js and @web3modal/ethers
- Implemented proper DApp architecture with wallet connection, token balance, and blockchain transactions
- Created locale-safe Web3 service with proper error handling and number formatting
- Added wallet connector component for seamless blockchain interaction
- Resolved DOM manipulation issues by replacing simulated "token" operations with real Web3 calls
- Enhanced lottery number selector with proper blockchain transaction handling

**Complete Token Pack Purchasing System (August 2025)**
- Implemented three-tier token purchasing system: 54 tokens ($3), 189 tokens ($9), 360 tokens ($15)
- Added comprehensive Stripe payment integration with secure backend processing
- Created dedicated Token Shop page with Stripe Elements checkout interface
- Enhanced database schema with token_packs and token_purchases tables
- Added complete API endpoints for payment processing and purchase tracking
- Integrated token purchasing flow with existing user token balance system
- Added navigation from dashboard to token shop for seamless user experience

**Major Color Palette Transformation (August 2025)**
- Completely redesigned color scheme with vibrant lottery and tourism industry colors
- Replaced dull, hard-to-read color palette with eye-catching gold, orange, purple, pink, teal and coral
- Enhanced button readability and contrast with new gradient button styles
- Added custom CSS classes for lottery, adventure, and travel themes
- Implemented gradient text effects and neon glow styles for premium visual appeal
- Updated all pages (Landing, Dashboard, Lotteries, Marketplace) with new vibrant theme
- Maintained accessibility while dramatically improving visual attractiveness

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on top of Radix UI primitives with gamified styling
- **Styling**: Tailwind CSS with vibrant lottery and tourism-themed color palette featuring gold, orange, purple, pink, teal, and coral colors for maximum visual appeal and readability
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation for Web3 wallet integration and user interactions
- **Animations**: Framer Motion for gamified feedback and smooth transitions
- **Audio System**: Howler.js for immersive sound effects (click, success, lottery, win sounds)
- **Gaming UX**: Age verification, confetti celebrations, animated buttons, floating particles
- **Responsible Gaming**: Age verification modal, security warnings, responsible gaming resources

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM for storing user data, missions, lottery results, and NFT metadata
- **Blockchain Integration**: Web3 API endpoints for token transactions and NFT minting
- **Storage**: PostgreSQL database with Drizzle ORM for persistent data storage
- **API Design**: RESTful API with Web3 integration for lottery mechanics and reward distribution
- **Validation**: Zod schemas for user submissions, lottery entries, and prize redemption

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