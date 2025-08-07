# TravelLotto DApp - Blockchain Tourism Lottery Platform

## Overview
TravelLotto is a comprehensive blockchain-based travel platform that combines verified lotteries with authentic travel experiences. The platform currently features:

**Travel Lottery System:** Three active travel lotteries with blockchain-verified draws (all restored and permanently active):
- Bali Cultural Immersion (8 days) - LT2025-101 
- Patagonia Wilderness Expedition (10 days) - LT2025-102
- Morocco Desert & Cities (12 days) - LT2025-103

**Viator Token Economy:** Three-token ecosystem with blockchain integration:
- Viator: Strong token ($1 USD value) for purchasing Kairos packs
- Kairos: Raffle ticket tokens (18 Raivan = 1 Kairos) for lottery entries
- Raivan: Reward tokens earned from activities and achievements

**Token Pack System:** Three Viator-purchasable Kairos packs:
- Starter Pack: 54 Kairos for 3 Viator ($3.00)
- Adventure Pack: 189 Kairos for 9 Viator ($9.00, most popular)
- Explorer Pack: 360 Kairos for 15 Viator ($15.00)

**Referral & Affiliate System:** Dual-tier partner program with comprehensive tracking:
- Travel Agency Partners: 18-28% commissions with enterprise features
- Individual Affiliates: 10-18% commissions with personal referral tools
- Complete analytics, payout management, and tier progression

**South American Expansion Plan:** Active operations across nine countries:
- Colombia, Peru, Ecuador, Bolivia, Chile, Uruguay, Paraguay, Argentina, Brazil
- Country-specific analytics, agency partnerships, and market penetration tracking
- Multi-currency support and regional customization

**Core Features:** Token-based economy with three-tier token pack system, mission verification system, QR code lottery verification, unique draw ID tracking, multi-language support (EN/ES/PT), comprehensive user management, and complete South American expansion program with 9 countries.

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