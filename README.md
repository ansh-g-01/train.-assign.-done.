# Train. Assign. Done.

Build a clickable prototype for an extremely simple workout management web application designed for independent gym trainers in India who are not very comfortable with technology.

The core product promise is: "Create a workout. Assign it to your client. Done."

Design principles:

Very simple interface with almost no learning curve.

Large, clear buttons and plain English.

Mobile-friendly layout.

No unnecessary dashboards, charts, nutrition features, AI chatbots or complicated settings.

Use realistic sample data, but no real customer information.

Create these screens:

My Clients: Show a list of clients with their names, profile pictures, and whether they completed today's workout. Include a prominent "Add Client" button.

Client Profile: Show the client's name, fitness goal, current workout plan and workout history. Include an obvious "Create Workout" button.

Workout Builder: Show an exercise library with image thumbnails, exercise names and a search field. Let the trainer add exercises to the workout, reorder them using drag and drop, and configure sets, repetitions and rest time.

Assign Workout: Let the trainer assign the workout to a particular date or repeat it on selected days.

Trainee Workout View: Show the assigned exercises as large visual cards with demonstrations, sets and repetitions. Allow the trainee to mark exercises as completed.

Make the main user flow functional using sample data: open a client, create a workout, add exercises, configure repetitions, assign it, and view the assigned workout.

Use a clean, professional design. Prioritise ease of use over visual complexity.

This is a prototype for customer interviews. Do not implement authentication, payments, real database storage or production infrastructure yet.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d18fcdeb-2e47-50ab-ab87-068c497a19a8).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Hosting on GitHub Pages

Every push to `main` builds a static version of the app and deploys it with
[.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml).
The site is served at `https://<user>.github.io/<repo-name>/`.

One-time setup: in the repo go to **Settings → Pages** and set **Source** to **GitHub Actions**.

To test the Pages build locally:

```sh
GITHUB_PAGES_BASE="/train.-assign.-done./" bun run build
```

The output is in `dist/client`. The workflow copies `_shell.html` to `index.html` and `404.html`.
