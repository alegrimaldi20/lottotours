# TravelLotto DApp - Blockchain Tourism Lottery Platform

## Overview
TravelLotto is a gamified blockchain-based DApp that combines digital lotteries with authentic travel experiences. Users participate in themed missions, lotteries, and challenges to earn tokens and NFTs redeemable for real travel packages, exclusive experiences, and tourism benefits. The platform features modern Web3 integration, a vibrant, tourism-themed UI, transparent blockchain mechanics, and an exclusive affiliate marketing system with unique referral links and scalable commission structures for individual users and travel agencies. It also includes a comprehensive unique ID system for all draws and activities, a strategic travel agency partnership module, and a legal compliance framework. The business vision is to expand into South American markets, initially targeting nine countries, and support multi-country operations for travel agencies.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with a vibrant lottery and tourism-themed color palette (gold, orange, purple, pink, teal, coral)
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion for gamified feedback and smooth transitions
- **Design Principles**: Clean, accessible interface focused on travel and tourism, optimized for professional appearance by removing excessive gaming animations and sounds.
- **Key Features**: Flexible ticket quantity selection, single ticket quick pick, "Add 1 More Random Ticket" option, real-time token balance updates, multilingual system (English, Spanish, Portuguese), and a professional platform aesthetic.

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM for user data, missions, lottery results, and NFT metadata
- **Blockchain Integration**: Web3 API endpoints for token transactions and NFT minting
- **API Design**: RESTful API with Web3 integration for lottery mechanics and reward distribution
- **Validation**: Zod schemas for user submissions, lottery entries, and prize redemption.
- **Key Features**: Complete unique ID tracking system for draws and activities, comprehensive token pack purchasing system with Stripe integration, and a comprehensive mission verification architecture with four methods (Auto, Proof Required, Manual Review, Time-based).

### Data Storage Solutions
- **ORM**: Drizzle ORM configured for PostgreSQL with a schema-first approach
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Schema Management**: Centralized schema definitions with automatic TypeScript type generation
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
- **Shadcn/ui**: Complete UI component system
- **Radix UI**: Unstyled, accessible UI primitives
- **Lucide React**: Icon library
- **Tailwind CSS**: Utility-first CSS framework

### Development and Build Tools
- **Vite**: Frontend build tool
- **TypeScript**: Type safety across the application
- **ESBuild**: Fast JavaScript bundler
- **PostCSS**: CSS processing

### Form and Validation Libraries
- **React Hook Form**: Performance-focused forms
- **Zod**: Runtime type validation and schema definition
- **Hookform Resolvers**: Integration between React Hook Form and Zod

### Date and Time Handling
- **date-fns**: Lightweight date manipulation and formatting library

### Web3 Libraries
- **ethers.js**: For interacting with the Ethereum blockchain
- **@web3modal/ethers**: For wallet connection and management

### Payment Processing
- **Stripe**: For secure token pack purchasing