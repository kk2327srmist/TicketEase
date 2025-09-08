TicketEase is a simple web-based ticket management system to capture issues, set priority, and track status (Open, In Progress, Closed). It includes fast search and status filtering, and persists data in the browser via localStorage. Built with HTML, CSS, and JavaScript.

What it is
TicketEase is a frontend-only ticket manager: create, view, update status, delete, filter, and search tickets.
Data persists in the browser using localStorage (no backend).
Files
index.html: Page structure (form, filters, ticket list, template).
styles.css: Layout and styling.
app.js: All logic (state, rendering, events, localStorage).
Data model
Each ticket: { id, title, description, priority, status, createdAt }
Stored under key ticketease_tickets_v1 in localStorage as an array.
UI flow
1) Create ticket
Fill Title, Description, Priority → Add Ticket.
A new ticket is created with status Open and saved to localStorage.
2) View tickets
Tickets render in a list with Title, Priority badge, Status badge, Created timestamp, Description.
3) Update status
Use the dropdown on each ticket to switch between Open, In Progress, Closed.
Change is saved and UI re-renders.
4) Delete tickets
Click Delete on a ticket to remove it.
Click Clear All in header to remove all tickets.
5) Filter and search
Search box filters by text in title/description (live).
Status dropdown filters by status or shows All.
How it works (code)
Load: Reads tickets from localStorage and calls render().
Render: Applies search/status filters, builds DOM from a hidden <template> per ticket, and injects event handlers (status change, delete).
Add: On form submit, validates inputs, creates a ticket with a unique id, saves to localStorage, re-renders.
Update/Delete: Modifies localStorage and re-renders.
Clear All: Empties the array in localStorage and re-renders.
