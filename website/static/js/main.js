// Function removed - now handled by sorting.js

document.getElementById('search-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const query = document.getElementById('file-search').value;
    console.log(query)
    if (query === '') {
        showToast('Search field is empty', 'warning');
        return;
    }
    const path = '/?path=/search_' + encodeURI(query);
    console.log(path)
    window.location = path;
});

// Loading Main Page

document.addEventListener('DOMContentLoaded', function () {
    const inputs = ['new-folder-name', 'rename-name', 'file-search']
    for (let i = 0; i < inputs.length; i++) {
        document.getElementById(inputs[i]).addEventListener('input', validateInput);
    }

    if (getCurrentPath().includes('/share_')) {
        getCurrentDirectory()
    } else {
        if (getPassword() === null) {
            document.getElementById('bg-blur').style.zIndex = '2';
            document.getElementById('bg-blur').style.opacity = '0.1';

            document.getElementById('get-password').style.zIndex = '3';
            document.getElementById('get-password').style.opacity = '1';
        } else {
            getCurrentDirectory()
        }
    }

    // Theme Toggle Logic
    const themeBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;

    // Check local storage
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        updateIcon(true);
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateIcon(isDark);
        });
    }

    function updateIcon(isDark) {
        if (!themeIcon) return;
        if (isDark) {
            // Sun Icon (Material Design Wb_sunny 24px)
            themeIcon.setAttribute("viewBox", "0 0 24 24");
            themeIcon.innerHTML = '<path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>';
        } else {
            // Moon Icon (Original 24px)
            themeIcon.setAttribute("viewBox", "0 0 24 24");
            themeIcon.innerHTML = '<path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>';
        }
    }


    // Sidebar Toggle Logic
    const sidebarBtn = document.getElementById('sidebar-toggle-btn');
    const container = document.querySelector('.container');
    const sidebar = document.querySelector('.sidebar');

    // Check local storage for sidebar state
    if (localStorage.getItem('sidebar') === 'collapsed') {
        container.classList.add('sidebar-collapsed');
    }

    if (sidebarBtn) {
        sidebarBtn.addEventListener('click', () => {
            // On mobile, toggle sidebar visibility
            if (window.innerWidth <= 768) {
                sidebar.classList.toggle('mobile-open');
            } else {
                // On desktop, use collapse
                container.classList.toggle('sidebar-collapsed');
                const isCollapsed = container.classList.contains('sidebar-collapsed');
                localStorage.setItem('sidebar', isCollapsed ? 'collapsed' : 'expanded');
            }
        });
    }
    
    // Close mobile sidebar when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !sidebarBtn.contains(e.target)) {
                sidebar.classList.remove('mobile-open');
            }
        }
    });
});