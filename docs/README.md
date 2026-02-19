# Portfolio Project

This is a personal portfolio website showcasing expertise in Backend, Frontend, Embedded Systems, and DevOps.

## Tech Stack

-   **Runtime:** Bun
-   **Framework:** React + Vite
-   **Language:** TypeScript
-   **Routing:** TanStack Router
-   **3D Graphics:** React Three Fiber (R3F) + Drei
-   **Styling:** Tailwind CSS v4
-   **Testing:** Vitest (Unit), Playwright (E2E)

## Setup

1.  Install dependencies:
    ```bash
    bun install
    ```

2.  Run development server:
    ```bash
    bun dev
    ```

3.  Run tests:
    ```bash
    bun test        # Unit tests
    bun test:e2e    # E2E tests
    ```

## Architecture

See [Architecture Overview](./architecture/overview.md) for details on the project structure and data flow.

## Features

-   **Mahoraga Wheel Navigation:** A 3D interactive wheel that rotates to navigate between sections. See [Wheel Logic](./features/wheel_logic.md).
