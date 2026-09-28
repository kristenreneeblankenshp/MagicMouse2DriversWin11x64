# Project Planner

A single-file project management app. Open `index.html` in any modern browser; you don't need to install anything or run a server.

## Features

- **Projects (lists).** Group work into projects. Use the sidebar to create, rename, delete, or switch between them, or pick "All projects".
- **To-dos.** Each item has a status (To do / In progress / On hold / Done), a priority, tags, notes, and a checklist of steps.
- **Dates.** Set start and due dates. You get overdue and due-this-week groupings, a **Calendar** month view (click a day to add an item due that day), and a **Timeline** (Gantt) view.
- **Research.** Research items add a research question, findings, and a list of sources/links. The **Research** tab shows them as cards.
- **Dependencies.** Under "Depends on", link an item to the work that must finish first.
  - Items waiting on unfinished work are flagged "Waiting on N".
  - Circular dependencies are blocked automatically.
  - "Schedule conflict" warnings appear when an item starts before one of its dependencies is due.
  - The **Dependencies** tab lists what's ready to start, what's waiting, and any conflicts, and draws a dependency graph.
  - The Timeline draws dependency arrows between bars.
- **Board.** A Kanban board. Drag cards between status columns.
- Search and filters (type, status, priority, hide done), plus light/dark theme.

## Data

Data is saved in your browser's `localStorage`, so it stays on this device and in this browser only. Use **Export JSON** to back it up or move it to another browser, and **Import JSON** to restore it. The first launch loads a small sample project; delete it whenever you like.
