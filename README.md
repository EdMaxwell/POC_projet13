# SupportChatPoc

This is a proof-of-concept for a multi-user support chat application built with Angular. The PoC demonstrates real-time conversation between two users using browser tabs, without requiring a backend server.

## Features

- **Fake Login System**: Simple authentication that works with any username/password
- **Multi-User Chat**: Multiple users can chat in the same conversation
- **Real-Time Sync**: Messages sync instantly across browser tabs using localStorage
- **No Backend Required**: Fully client-side implementation
- **Persistent State**: User sessions and messages persist across page refreshes

## Quick Start

### Development server

To start a local development server, run:

```bash
npm install
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`.

### Demo: Two-User Chat

1. Open `http://localhost:4200` in your browser
2. Log in with any username (e.g., "alice")
3. Open a new tab/window at `http://localhost:4200`
4. Log in with a different username (e.g., "bob")
5. Start chatting - messages will appear in both windows in real-time!

## Building

To build the project run:

```bash
npm run build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
npm test
```

For headless testing (useful for CI/CD):

```bash
npm test -- --watch=false --browsers=ChromeHeadless
```

## Technology Stack

- **Angular 19** - Frontend framework
- **TypeScript** - Type-safe JavaScript
- **localStorage** - Client-side data persistence
- **Storage Events** - Cross-tab communication
- **Jasmine/Karma** - Testing framework

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
