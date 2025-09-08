(function(){
  const STORAGE_KEY = 'ticketease_tickets_v1';

  /** @typedef {{id:string,title:string,description:string,priority:'low'|'medium'|'high',status:'open'|'in_progress'|'closed',createdAt:number}} Ticket */

  /** @type {HTMLFormElement} */
  const form = document.getElementById('ticketForm');
  /** @type {HTMLUListElement} */
  const list = document.getElementById('ticketList');
  /** @type {HTMLInputElement} */
  const searchInput = document.getElementById('searchInput');
  /** @type {HTMLSelectElement} */
  const statusFilter = document.getElementById('statusFilter');
  /** @type {HTMLButtonElement} */
  const clearAllBtn = document.getElementById('clearAll');
  /** @type {HTMLTemplateElement} */
  const template = document.getElementById('ticketItemTemplate');

  /** @returns {Ticket[]} */
  function loadTickets(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if(!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    }catch(e){
      console.error('Failed to parse tickets', e); return [];
    }
  }

  /** @param {Ticket[]} tickets */
  function saveTickets(tickets){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  }

  /** @returns {Ticket[]} */
  function getTickets(){
    return loadTickets();
  }

  /** @param {Ticket} ticket */
  function addTicket(ticket){
    const tickets = getTickets();
    tickets.push(ticket);
    saveTickets(tickets);
  }

  /** @param {string} id */
  function deleteTicket(id){
    const tickets = getTickets().filter(t => t.id !== id);
    saveTickets(tickets);
  }

  /** @param {string} id @param {Partial<Ticket>} updates */
  function updateTicket(id, updates){
    const tickets = getTickets().map(t => t.id === id ? {...t, ...updates} : t);
    saveTickets(tickets);
  }

  function uid(){
    return 't_' + Math.random().toString(36).slice(2,8) + Date.now().toString(36);
  }

  function formatDate(ts){
    const d = new Date(ts);
    return d.toLocaleString();
  }

  function render(){
    const all = getTickets();
    const query = (searchInput.value || '').toLowerCase();
    const status = statusFilter.value;

    const filtered = all.filter(t => {
      const matchesStatus = status === 'all' ? true : t.status === status;
      const text = (t.title + ' ' + t.description).toLowerCase();
      const matchesQuery = !query ? true : text.includes(query);
      return matchesStatus && matchesQuery;
    });

    list.innerHTML = '';
    if(filtered.length === 0){
      const empty = document.createElement('li');
      empty.className = 'ticket-item';
      empty.textContent = 'No tickets found.';
      list.appendChild(empty);
      return;
    }

    for(const t of filtered){
      const node = /** @type {HTMLElement} */(template.content.firstElementChild).cloneNode(true);
      node.dataset.id = t.id;
      node.querySelector('.ticket-title').textContent = t.title;
      node.querySelector('.ticket-desc').textContent = t.description;

      const priorityEl = node.querySelector('.badge.priority');
      priorityEl.textContent = t.priority.charAt(0).toUpperCase() + t.priority.slice(1);
      priorityEl.classList.add(t.priority);

      const statusBadge = node.querySelector('.badge.status');
      const friendlyStatus = t.status === 'in_progress' ? 'In Progress' : t.status.charAt(0).toUpperCase() + t.status.slice(1);
      statusBadge.textContent = friendlyStatus;
      statusBadge.classList.add(t.status);

      node.querySelector('.created').textContent = formatDate(t.createdAt);

      const statusSelect = node.querySelector('.status-select');
      statusSelect.value = t.status;
      statusSelect.addEventListener('change', (e)=>{
        const value = e.target.value;
        updateTicket(t.id, { status: value });
        render();
      });

      node.querySelector('.delete-btn').addEventListener('click', ()=>{
        deleteTicket(t.id);
        render();
      });

      list.appendChild(node);
    }
  }

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const formData = new FormData(form);
    const title = String(formData.get('title')||'').trim();
    const description = String(formData.get('description')||'').trim();
    const priority = String(formData.get('priority')||'medium');
    if(!title || !description){
      return;
    }
    const ticket = {
      id: uid(),
      title,
      description,
      priority,
      status: 'open',
      createdAt: Date.now()
    };
    addTicket(ticket);
    form.reset();
    render();
  });

  searchInput.addEventListener('input', render);
  statusFilter.addEventListener('change', render);
  clearAllBtn.addEventListener('click', ()=>{
    if(confirm('Delete all tickets?')){
      saveTickets([]);
      render();
    }
  });

  // initial render
  render();
})();


