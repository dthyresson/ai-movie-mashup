# AI Movie Mashup

AI Movie Mashup is a fun RedwoodSDK experiment that combines elements (aka "mashes up") from two different movies to create unique, AI-generated movie concepts. It uses artificial intelligence to generate new movie ideas, complete with titles, taglines, plots, posters, and audio of the plot.

## Video Demo

I recorded a video demo of the app that shows the main features in action.

[👀 Watch the Demo](https://screen.studio/share/JRN2137W)

## Features

- **Movie Selection**: Choose two movies to combine into a unique mashup
- **AI-Generated Content**: Automatically generates:
  - Creative movie titles
  - Engaging taglines
  - Detailed plot summaries
  - Custom movie posters
  - Audio text to speech of the mashup plot
- **User Management**: Secure authentication and user profiles
- **Mashup Gallery**: Browse and explore previously created mashups
- **Asynchronous Processing**: Asynchronous processing of mashup requests with Cloudflare Queues

## Technology Stack

- **RedwoodSDK**: https://www.rwsdk.com
  - React with TypeScript, React Server Components, Cloudflare Workers
- **AI**: Cloudflare AIs
- **Database**: Cloudflare D1 with Prisma ORM
- **Queue**: Cloudflare Queues
- **Image Generation**: Cloudflare R2 and D1
- **Storage**: Cloudflare R2
- **Authentication**: WebAuthn for secure user authentication
- **Styling**: Tailwind CSS
- **Build Tools**: Vite

## Database Schema and Data Models

### Movies

The `Movie` model represents individual movies in the system:

- `id`: Unique identifier for the movie
- `createdAt`: Timestamp of when the movie was added
- `title`: Movie title
- `photo`: URL/path to movie poster image
- `overview`: Movie description/synopsis
- `releaseDate`: Original release date of the movie
- Relations:
  - Connected to `Mashup` model as either movie1 or movie2

### Users

The `User` model handles user authentication and management:

- `id`: UUID-based unique identifier
- `username`: Unique username for the user
- `createdAt`: Account creation timestamp
- Relations:
  - Has associated `Credential` records for WebAuthn authentication

### Credentials

The `Credential` model manages WebAuthn authentication:

- `id`: UUID-based identifier
- `userId`: Associated user ID
- `credentialId`: Unique WebAuthn credential identifier
- `publicKey`: Stored public key for authentication
- `counter`: Authentication counter
- `createdAt`: Credential creation timestamp

### Mashups

The `Mashup` model stores generated movie combinations:

- `id`: CUID-based unique identifier
- `createdAt`: Timestamp of mashup creation
- `movie1Id`: First source movie ID
- `movie2Id`: Second source movie ID
- `title`: AI-generated mashup title
- `tagline`: AI-generated tagline
- `plot`: AI-generated plot summary
- `imageKey`: Reference to generated poster image in storage
- `imageDescription`: AI-generated image prompt/description
- `audioKey`: Reference to generated audio narration
- `status`: Processing status (PENDING, COMPLETED, FAILED)
- Relations:
  - Links to two source `Movie` records

## AI Models

The application leverages several Cloudflare AI models for different functionalities:

- **Text Generation**: `@cf/meta/llama-3.1-8b-instruct`

  - Used for generating movie titles, taglines, plots, and poster descriptions
  - Based on Meta's Llama 3.1 8B parameter model

- **Image Generation**: `@cf/black-forest-labs/flux-1-schnell`

  - Creates unique movie posters based on AI-generated descriptions
  - Powered by Black Forest Labs' Flux model

- **Text-to-Speech**: `@cf/myshell-ai/melotts`
  - Generates audio descriptions of the mashup movies
  - Uses MyShell AI's MeloTTS model for natural-sounding narration

## Getting Started

### Prerequisites

- Node.js (Latest LTS version)
- pnpm package manager
- Cloudflare account (for deployment)

### Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd movie-mashup
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration values.

4. Initialize the database:

```bash
pnpm migrate:dev
```

5. Seed the database with movies:

```bash
pnpm seed
```

6. Start the development server:

```bash
pnpm dev
```

### Development

- `pnpm dev` - Start the development server
- `pnpm build` - Build the application
- `pnpm migrate:dev` - Run database migrations locally
- `pnpm migrate:prd` - Run database migrations in production
- `pnpm format` - Format code using Prettier

### Deployment

To deploy to Cloudflare:

```bash
pnpm release
```

## Project Structure

- `/src/app` - Main application components
- `/src/app/pages/mashups` - Movie mashup functionality
- `/src/session` - User session management
- `/prisma` - Database schema and migrations
- `/migrations` - Database migration files

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
