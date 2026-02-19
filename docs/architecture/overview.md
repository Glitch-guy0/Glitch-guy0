# Architecture Overview

This document outlines the high-level architecture of the portfolio project.

## Core Flow

The application is built around the TanStack Router, which drives the state of the 3D scene (Mahoraga Wheel) and the UI content.

```mermaid
graph TD
    User[User] -->|Click Wheel| WheelComponent
    User[User] -->|Direct URL| Router

    subgraph "Core Logic"
        Router[TanStack Router]
        Router -->|Current Path| ExpertiseFactory
        ExpertiseFactory -->|Config (Color, Title)| UI_Overlay
        ExpertiseFactory -->|Rotation Angle| WheelComponent
    end

    subgraph "3D Scene (R3F)"
        WheelComponent[Mahoraga Wheel Model]
        Scene[R3F Canvas]
        Scene --> WheelComponent
    end

    subgraph "UI Layer"
        UI_Overlay[Background Text & Content]
    end

    WheelComponent -->|Navigate()| Router
    Router -->|Update State| UI_Overlay
    Router -->|Animate Rotation| WheelComponent
```

## Directory Structure

-   `src/core`: Contains the business logic (factories) and configuration.
-   `src/components/3d`: React Three Fiber components.
-   `src/components/ui`: React UI components (Loading, Layouts).
-   `src/routes`: Route definitions.
-   `src/lib`: Utility functions.
