# Mahoraga Wheel Logic

The Mahoraga Wheel is the central navigational element of the portfolio.

## Navigation Mechanics

-   **Rotation:** Each "click" on the wheel rotates it **45 degrees** (clockwise) on its Z-axis (relative to the camera view).
-   **Navigation:** Clicking the wheel triggers a route change to the *next* expertise in the predefined sequence.

## Expertise Sequence

1.  **Backend** (Red) - 0°
2.  **Frontend** (Blue) - 45°
3.  **Embedded** (Green) - 90°
4.  **DevOps** (Purple) - 135°

The sequence loops: `Backend -> Frontend -> Embedded -> DevOps -> Backend`.

## Animation States

1.  **Loading:**
    -   **View:** Top-down (wheel flat on screen).
    -   **Animation:** Spinning continuously.
    -   **Color:** Cycling through expertise colors.

2.  **Loaded (Intro):**
    -   **Transition:** Wheel stops spinning, rotates 90° on X-axis to face the user (Front View), and moves to `top: 33%` of the viewport.

3.  **Interactive:**
    -   **View:** Front-facing, positioned at top 1/3.
    -   **Interaction:** User clicks to rotate and navigate.
