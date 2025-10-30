# EchoDownloader

A visually stunning web application that provides a simulated experience of downloading YouTube videos as MP4 or MP3 files, complete with progress tracking and controls.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/sagarrakshe/echodownloader)

EchoDownloader is a highly interactive web application designed to simulate the experience of downloading videos from YouTube. The user interface is clean, modern, and built with exceptional attention to detail, providing a seamless and intuitive user journey. The core of the application is a central input field where a user can paste a YouTube URL. Upon entry, the application will feature format selection tabs (MP4/MP3) and a download button. When a download is initiated, a new 'Download Card' dynamically appears in a dedicated section below. Each card provides a rich visual representation of the download's status, including a placeholder thumbnail, video title, a beautifully animated progress bar, and controls to pause, resume, or cancel the download.

**Note:** All functionality, including download progress and state changes, is simulated on the client-side to create a realistic and engaging demonstration of a premium downloader application. It does not actually download videos from YouTube.

## Key Features

- **Simulated YouTube Downloads**: Paste a YouTube URL to initiate a simulated download process.
- **Format Selection**: Choose between MP4 and MP3 formats before starting a download.
- **Dynamic Download Cards**: Each download appears as an interactive card in the UI.
- **Real-time Progress Tracking**: Visually track download progress with an animated progress bar.
- **Download Controls**: Pause, resume, and cancel ongoing downloads.
- **Modern & Responsive UI**: A clean, beautiful interface built with shadcn/ui and Tailwind CSS that works flawlessly on all devices.
- **Smooth Animations**: Fluid animations and micro-interactions powered by Framer Motion for a premium user experience.
- **Client-Side State Management**: All application state is managed efficiently on the client using Zustand.

## Technology Stack

- **Frontend**: React, Vite, TypeScript
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: Zustand
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Validation**: Zod
- **Backend & Deployment**: Hono on Cloudflare Workers

## Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Bun](https://bun.sh/) package manager

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/echo_downloader.git
    cd echo_downloader
    ```

2.  **Install dependencies:**
    ```sh
    bun install
    ```

### Running the Development Server

To start the local development server, which includes both the Vite frontend and the Hono backend worker:

```sh
bun dev
```

The application will be available at `http://localhost:3000` (or the port specified in your environment).

## Project Structure

-   `src/`: Contains all the frontend React application code, including pages, components, hooks, and styles.
-   `worker/`: Contains the Hono backend code for the Cloudflare Worker. For this project, it serves the frontend and provides a basic API structure.
-   `shared/`: Contains types and data structures shared between the frontend and the worker.
-   `public/`: Static assets for the frontend.

## Development

The application is designed as a single-page application. The main view is located at `src/pages/HomePage.tsx`. This is where the primary UI and logic for the downloader are implemented.

-   **UI Components**: Reusable components are built using `shadcn/ui` and can be found in `src/components/ui/`.
-   **State Management**: The global state for downloads is managed by a Zustand store. You can find the store implementation within the `src/pages/HomePage.tsx` or a dedicated store file.
-   **Styling**: Styling is handled by Tailwind CSS. You can customize the theme and add global styles in `src/index.css` and `tailwind.config.js`.

## Deployment

This project is optimized for deployment to Cloudflare Pages with a Functions backend.

### One-Click Deploy

You can deploy this application to your own Cloudflare account with a single click.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/sagarrakshe/echodownloader)

### Manual Deployment via CLI

1.  **Login to Cloudflare:**
    ```sh
    bunx wrangler login
    ```

2.  **Build the application:**
    This command bundles both the frontend assets and the worker code.
    ```sh
    bun run build
    ```

3.  **Deploy to Cloudflare:**
    This command will deploy your application and set up the necessary bindings.
    ```sh
    bun run deploy
    ```

After deployment, Wrangler will provide you with the URL to your live application.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.