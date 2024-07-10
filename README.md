# Stream4You 

## Introduction
Stream4You is an innovative streaming platform developed using cutting-edge technologies like Node.js, TypeScript, Express, and Prisma. It offers a robust solution for managing and streaming audio content, powered by Elasticsearch for efficient searching and Redis for performance optimization. Additionally, it features a separate frontend music player component built with React for a seamless user experience.

## Key Features
- User Management: Allows users to create accounts, log in, and manage their profiles.
- Audio Streaming: Provides functionalities for querying, streaming, and managing audio files.
- Advanced Search: Leverages Elasticsearch to enable fast and accurate searches across the audio library.
- Performance Enhancement: Utilizes Redis for caching to improve application speed and responsiveness.
- Database Management: Employs Prisma for handling database migrations and schema management.

## Getting Started
### Prerequisites
- Docker: Required for building and running the application containers.
### Installation

- 1- Clone the Repository
  ```
  git clone <repository-url>
  ```
  ```
  cd stream4you
  ```

- 2- Configuration
  
  Ensure environment variables such as DATABASE_URL and SECRET are configured according to your deployment environment. These can be set in a .env file or passed directly to the Docker container.
  
- 3- Build the Docker Image
  ```
  docker build -t stream4you .
  ```
- 4- Run the Docker Container
  ```
  docker run -d -p 3001:3001 -p 9200:9200 -p 5432:5432 -p 6379:6379 -p 3000:3000 stream4you
  ```

## Usage
After setting up and configuring the application, you can access the backend API at http://localhost:3001/api. The frontend music player will be available at http://localhost:3000.

## Technical Architecture

### Backend Technologies
- Node.js and Express: Core backend framework.
- TypeScript: Ensures type safety throughout the codebase.
- Elasticsearch: Used for advanced search capabilities.
- Redis: Employed for caching to enhance performance.
- PostgreSQL: Primary database for storing user and audio data.
- Prisma: ORM for database operations and migrations.

## Frontend Component
- The frontend music player is built with React, offering a dynamic and interactive user interface.

## Database Schema
- User Model:

  Defines the structure for user-related data, including authentication tokens and associated audio tracks.

- Audio Model:

Specifies the schema for audio content, linking each track to its owner and containing metadata like title, genre, and artist.


## Contributing
We welcome contributions from the community. Please feel free to fork the repository, make changes, and submit a pull request.
