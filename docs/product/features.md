# Features

daybook is for **one person planning their own days**. It isn't a team tool: no shared boards, members or comments from other people. The database is still multi-user (every row has a `user_id`), so a public demo account can live next to real accounts.

## The building blocks
- **List**: a project or area of life ("Work", "Home", "Thesis"). Replaces KanbanIA's "boards". Has a name, a description, a colour and can be archived.
- **Status**: a column inside a list ("To do", "Doing", "Done"). One or more statuses are marked *done*; moving a task there completes it.
- **Task**: the thing to do. It can have:
  - a title and notes;
  - a priority (low, medium, high);
  - a **due date** (a day, no time) and/or a **scheduled time block** (start and end, or all-day);
  - a time estimate;
  - labels, a checklist, a "blocked because…" note, and attachments (images or PDFs).
- **Label**: a coloured tag shared across all lists ("errand", "deep work").
- **Inbox**: every account gets an "Inbox" list at sign-up, so a quick capture always has a home.

## Screens (step 1, web)

| Screen | Route | What it shows |
|---|---|---|
| Today | `/today` | Overdue, due today, scheduled today. The home screen after login. |
| Calendar | `/calendar` | Month / week / day. Time blocks for scheduled tasks, all-day markers for due dates. Drag to reschedule, click an empty slot to create. |
| Lists | `/lists` | All lists, with task counts. |
| List board | `/lists/:id` | The kanban board: drag tasks between statuses. |
| Task | modal on any screen | Edit every field, checklist, labels, attachments. |
| Settings | `/settings` | Profile (name, picture), time zone, **language**, **theme** (light / dark / system), sessions ("log out other devices"). |
| Log in / Register | `/login`, `/register` | Register can be turned off on the public demo. |

## Key flows
1. **Plan my day:** open Today, see what's overdue, drag a task onto a time slot in the day view.
2. **Capture quickly:** press the "add" shortcut anywhere, type a title, and it lands in Inbox.
3. **Reschedule:** drag a block in the calendar. The API updates `scheduledStart/End` in one call.
4. **Finish a task:** tick it on Today or drag it to a *done* status. Both set `completedAt`.

## Later (designed for, not built in step 1)
- Recurring tasks (an RRULE string on the task), reminders and notifications (native apps first).
- Search, keyboard shortcuts everywhere, import/export (JSON/CSV).
- Offline use in the native apps, with sync.
- Thumbnails for images; direct-to-storage uploads for large files.

## Out of scope
Collaboration (members, sharing, comments by others), avatars of other people, real-time multi-user editing.

## Open questions for me
- Should Inbox be deletable, or always exist?
- Does a task without a due date or a time block appear anywhere besides its list (a "someday" view)?
