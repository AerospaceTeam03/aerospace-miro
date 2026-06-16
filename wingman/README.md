# Wingman — How to Run the App

Wingman is the flight delay-risk decision tool for airline operations desks. This guide
walks you through running it on your own computer, **step by step**. You do not need to be
a programmer — just follow the instructions for your operating system.

It takes about 10–15 minutes the first time.

---

## What you need to install

Two pieces of free software:

1. **Node.js** — the engine that runs the app.
2. **pnpm** — the tool that downloads the app's building blocks and starts it.

Follow the section for your computer below. **Windows** and **macOS** differ only in how you
install the software; once installed, the commands are identical.

---

## Windows

### 1. Install Node.js

1. Go to **https://nodejs.org**.
2. Click the big button that says **"LTS"** (the recommended version) to download the
   installer.
3. Open the downloaded file (`.msi`) and click **Next / Next / Install**, accepting the
   default options. When it finishes, click **Finish**.

### 2. Open the Terminal

1. Press the **Windows key**, type **`PowerShell`**, and press **Enter**.
2. A blue or black window with a blinking cursor appears. This is where you'll type
   commands. (Tip: you can paste with **right-click** or **Ctrl + V**.)

### 3. Install pnpm

In the PowerShell window, type the following and press **Enter**:

```powershell
npm install -g pnpm
```

Wait for it to finish (a few lines of text will appear).

➡️ Now skip down to **"Running the app"** below.

---

## macOS

### 1. Install Node.js

1. Go to **https://nodejs.org**.
2. Click the big button that says **"LTS"** (the recommended version) to download the
   installer.
3. Open the downloaded file (`.pkg`) and click **Continue / Continue / Install**, accepting
   the default options. Enter your Mac password if asked, then click **Close**.

### 2. Open the Terminal

1. Press **Cmd + Space** to open Spotlight search.
2. Type **`Terminal`** and press **Enter**.
3. A window with a blinking cursor appears. This is where you'll type commands. (Tip: you
   can paste with **Cmd + V**.)

### 3. Install pnpm

In the Terminal window, type the following and press **Enter**:

```bash
npm install -g pnpm
```

Wait for it to finish (a few lines of text will appear).

➡️ Continue to **"Running the app"** below.

---

## Running the app

The remaining steps are the **same on Windows and macOS**. Type each command into the
terminal window you opened, pressing **Enter** after each one.

### 1. Go to the app's folder

You need to point the terminal at the `wingman` folder of this project. Type `cd ` (with a
space after it), then drag the `wingman` folder from your file explorer / Finder into the
terminal window — this fills in the path automatically — and press **Enter**.

It looks something like this:

```bash
cd path/to/aerospace-miro/wingman
```

### 2. Download the app's building blocks

Run this **once**. It downloads everything the app needs:

```bash
pnpm install
```

This may take a couple of minutes the first time. It's done when the cursor returns.

### 3. Start the app

```bash
pnpm dev
```

After a moment you'll see a message that includes a web address like
**`http://localhost:3000`**.

### 4. Open it in your browser

Open your web browser (Chrome, Edge, Safari, Firefox…) and go to:

**http://localhost:3000**

Wingman is now running on your computer. 🎉

---

## Stopping and restarting

- **To stop the app:** click the terminal window and press **Ctrl + C** (on both Windows
  and macOS).
- **To start it again later:** open the terminal, go to the folder again (step 1), and run
  `pnpm dev`. You do **not** need to run `pnpm install` again unless the project's building
  blocks have changed.

---

## If something goes wrong

| Problem | What to do |
| --- | --- |
| `pnpm` or `npm` is "not recognized" / "command not found" | Close the terminal completely and open a new one, then try again. If it still fails, Node.js didn't install correctly — reinstall it from https://nodejs.org. |
| Port 3000 is "already in use" | Another copy of the app is probably still running. Close other terminal windows, or restart your computer, then try `pnpm dev` again. |
| The browser page won't load | Make sure the terminal still shows the app running (it stays open while the app runs). Check the address is exactly `http://localhost:3000`. |

---

## For developers

Technical details — the tech stack, project structure, and contribution rules — live in
**[`CLAUDE.md`](./CLAUDE.md)**. Useful commands:

```bash
pnpm dev      # start the development server (http://localhost:3000)
pnpm build    # create a production build
pnpm start    # run the production build
pnpm lint     # check code quality
```
