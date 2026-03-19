document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    // Navigation Logic
    const navLinks = document.querySelectorAll('.side-nav a[data-target]');
    const views = document.querySelectorAll('.view-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');
            
            const targetId = link.getAttribute('data-target');
            views.forEach(view => {
                view.classList.remove('active');
                if(view.id === targetId) view.classList.add('active');
            });
            
            // Refresh data when navigating
            if(targetId === 'messages-view') fetchMessages();
            if(targetId === 'projects-view') fetchProjects();
            if(targetId === 'dashboard-view') fetchStats();
        });
    });

    // API Handling
    function fetchStats() {
        fetch('/api/contacts').then(res => res.json())
            .then(data => document.getElementById('total-messages').innerText = data.length || 0);
        fetch('/api/projects').then(res => res.json())
            .then(data => document.getElementById('total-projects').innerText = data.length || 0);
    }

    function fetchMessages() {
        const tableBody = document.getElementById('messages-table-body');
        tableBody.innerHTML = '<tr><td colspan="7">Loading...</td></tr>';
        
        fetch('/api/contacts').then(res => res.json()).then(data => {
            tableBody.innerHTML = '';
            data.forEach(msg => {
                tableBody.innerHTML += `
                    <tr>
                        <td>#${msg.id}</td>
                        <td>${new Date(msg.date).toLocaleDateString()}</td>
                        <td>${msg.name}</td>
                        <td>${msg.email}</td>
                        <td><span style="color:#D4E95E;">${msg.service}</span></td>
                        <td>${msg.message.substring(0, 40)}...</td>
                        <td><button class="btn-delete" onclick="deleteMessage(${msg.id})">Delete</button></td>
                    </tr>
                `;
            });
            if(data.length === 0) tableBody.innerHTML = '<tr><td colspan="7">No messages found.</td></tr>';
        });
    }

    function fetchProjects() {
        const tableBody = document.getElementById('projects-table-body');
        tableBody.innerHTML = '<tr><td colspan="4">Loading...</td></tr>';
        
        fetch('/api/projects').then(res => res.json()).then(data => {
            tableBody.innerHTML = '';
            data.forEach(proj => {
                tableBody.innerHTML += `
                    <tr>
                        <td>#${proj.id}</td>
                        <td>${proj.title}</td>
                        <td><span style="text-transform:uppercase; font-size:0.8rem; background:rgba(255,255,255,0.1); padding:4px 8px; border-radius:4px;">${proj.category}</span></td>
                        <td><button class="btn-delete" onclick="deleteProject(${proj.id})">Delete</button></td>
                    </tr>
                `;
            });
            if(data.length === 0) tableBody.innerHTML = '<tr><td colspan="4">No projects yet.</td></tr>';
        });
    }

    // Expose delete functions to global window for inline onclick handlers
    window.deleteMessage = (id) => {
        if(confirm('Are you sure you want to delete this message?')) {
            fetch(`/api/contacts/${id}`, { method: 'DELETE' }).then(() => { fetchMessages(); fetchStats(); });
        }
    };
    
    window.deleteProject = (id) => {
        if(confirm('Are you sure you want to delete this project?')) {
            fetch(`/api/projects/${id}`, { method: 'DELETE' }).then(() => { fetchProjects(); fetchStats(); });
        }
    };

    // Add Project Modal logic
    const modal = document.getElementById('add-project-modal');
    document.getElementById('open-add-project').addEventListener('click', () => modal.classList.add('active'));
    document.getElementById('close-project-modal').addEventListener('click', () => modal.classList.remove('active'));

    document.getElementById('add-project-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const payload = {
            title: document.getElementById('p-title').value,
            category: document.getElementById('p-cat').value,
            image: document.getElementById('p-img').value,
            link: document.getElementById('p-link').value,
            description: document.getElementById('p-desc').value
        };

        fetch('/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).then(res => res.json()).then(data => {
            modal.classList.remove('active');
            document.getElementById('add-project-form').reset();
            fetchProjects();
            fetchStats();
        });
    });

    // Initial Load
    fetchStats();
});
