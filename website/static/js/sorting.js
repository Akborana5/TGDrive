// File Sorting Functionality

let currentSortMethod = localStorage.getItem('sortMethod') || 'date-desc';
let currentDirectoryData = null;

// Initialize sort dropdown
document.addEventListener('DOMContentLoaded', function() {
    const sortBtn = document.getElementById('sort-toggle-btn');
    const sortMenu = document.getElementById('sort-menu');
    
    if (!sortBtn || !sortMenu) return;
    
    // Toggle sort menu
    sortBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sortMenu.classList.toggle('show');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!sortMenu.contains(e.target) && !sortBtn.contains(e.target)) {
            sortMenu.classList.remove('show');
        }
    });
    
    // Handle sort option clicks
    const sortOptions = sortMenu.querySelectorAll('.sort-option');
    sortOptions.forEach(option => {
        // Highlight current sort
        if (option.getAttribute('data-sort') === currentSortMethod) {
            option.classList.add('active');
        }
        
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Remove active from all
            sortOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active to clicked
            option.classList.add('active');
            
            // Update sort method
            currentSortMethod = option.getAttribute('data-sort');
            localStorage.setItem('sortMethod', currentSortMethod);
            
            // Re-sort and display
            if (currentDirectoryData) {
                sortAndDisplayDirectory(currentDirectoryData);
            }
            
            // Close menu
            sortMenu.classList.remove('show');
            
            showToast(`Sorted by: ${option.textContent.trim()}`, 'info', 2000);
        });
    });
});

// Enhanced showDirectory function with sorting
function sortAndDisplayDirectory(data) {
    currentDirectoryData = data;
    const contents = data['contents'];
    document.getElementById('directory-data').innerHTML = '';
    const isTrash = getCurrentPath().startsWith('/trash');

    let html = '';
    
    // Separate folders and files
    let entries = Object.entries(contents);
    let folders = entries.filter(([key, value]) => value.type === 'folder');
    let files = entries.filter(([key, value]) => value.type === 'file');

    // Apply sorting
    folders = applySorting(folders);
    files = applySorting(files);

    // Generate HTML for folders
    for (const [key, item] of folders) {
        html += generateFolderHTML(item, isTrash);
    }

    // Generate HTML for files
    for (const [key, item] of files) {
        html += generateFileHTML(item, isTrash);
    }
    
    document.getElementById('directory-data').innerHTML = html;

    // Add event listeners
    if (!isTrash) {
        document.querySelectorAll('.folder-tr').forEach(div => {
            if (isMobileDevice() || isTouchDevice()) {
                // Single tap for mobile
                div.onclick = openFolder;
            } else {
                // Double click for desktop
                div.ondblclick = openFolder;
            }
        });
        
        document.querySelectorAll('.file-tr').forEach(div => {
            if (isMobileDevice() || isTouchDevice()) {
                // Single tap for mobile
                div.onclick = openFile;
            } else {
                // Double click for desktop
                div.ondblclick = openFile;
            }
        });
    }

    document.querySelectorAll('.more-btn').forEach(div => {
        div.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            openMoreButton(div);
        });
    });
}

function applySorting(items) {
    const sortMethod = currentSortMethod;
    
    switch(sortMethod) {
        case 'date-desc': // Newest first (default)
            return items.sort((a, b) => new Date(b[1].upload_date) - new Date(a[1].upload_date));
        
        case 'date-asc': // Oldest first
            return items.sort((a, b) => new Date(a[1].upload_date) - new Date(b[1].upload_date));
        
        case 'name-asc': // A to Z
            return items.sort((a, b) => a[1].name.localeCompare(b[1].name));
        
        case 'name-desc': // Z to A
            return items.sort((a, b) => b[1].name.localeCompare(a[1].name));
        
        case 'size-desc': // Largest first
            return items.sort((a, b) => (b[1].size || 0) - (a[1].size || 0));
        
        case 'size-asc': // Smallest first
            return items.sort((a, b) => (a[1].size || 0) - (b[1].size || 0));
        
        default:
            return items.sort((a, b) => new Date(b[1].upload_date) - new Date(a[1].upload_date));
    }
}

function generateFolderHTML(item, isTrash) {
    let html = `<tr data-path="${item.path}" data-id="${item.id}" class="body-tr folder-tr">
        <td><div class="td-align"><img src="static/assets/folder-solid-icon.svg">${item.name}</div></td>
        <td><div class="td-align"></div></td>
        <td><div class="td-align"><a data-id="${item.id}" class="more-btn"><img src="static/assets/more-icon.svg" class="rotate-90"></a></div></td>
    </tr>`;

    if (isTrash) {
        html += `<div data-path="${item.path}" id="more-option-${item.id}" data-name="${item.name}" class="more-options">
            <input class="more-options-focus" readonly="readonly" style="height:0;width:0;border:none;position:absolute">
            <div id="restore-${item.id}" data-path="${item.path}"><img src="static/assets/load-icon.svg"> Restore</div>
            <hr>
            <div id="delete-${item.id}" data-path="${item.path}"><img src="static/assets/trash-icon.svg"> Delete</div>
        </div>`;
    } else {
        html += `<div data-path="${item.path}" id="more-option-${item.id}" data-name="${item.name}" class="more-options">
            <input class="more-options-focus" readonly="readonly" style="height:0;width:0;border:none;position:absolute">
            <div id="rename-${item.id}"><img src="static/assets/pencil-icon.svg"> Rename</div>
            <hr>
            <div id="trash-${item.id}"><img src="static/assets/trash-icon.svg"> Trash</div>
            <hr>
            <div id="folder-share-${item.id}"><img src="static/assets/share-icon.svg"> Share</div>
        </div>`;
    }
    
    return html;
}

function generateFileHTML(item, isTrash) {
    const size = convertBytes(item.size);
    let html = `<tr data-path="${item.path}" data-id="${item.id}" data-name="${item.name}" class="body-tr file-tr">
        <td><div class="td-align"><img src="static/assets/file-icon.svg">${item.name}</div></td>
        <td><div class="td-align">${size}</div></td>
        <td><div class="td-align"><a data-id="${item.id}" class="more-btn"><img src="static/assets/more-icon.svg" class="rotate-90"></a></div></td>
    </tr>`;

    if (isTrash) {
        html += `<div data-path="${item.path}" id="more-option-${item.id}" data-name="${item.name}" class="more-options">
            <input class="more-options-focus" readonly="readonly" style="height:0;width:0;border:none;position:absolute">
            <div id="restore-${item.id}" data-path="${item.path}"><img src="static/assets/load-icon.svg"> Restore</div>
            <hr>
            <div id="delete-${item.id}" data-path="${item.path}"><img src="static/assets/trash-icon.svg"> Delete</div>
        </div>`;
    } else {
        html += `<div data-path="${item.path}" id="more-option-${item.id}" data-name="${item.name}" class="more-options">
            <input class="more-options-focus" readonly="readonly" style="height:0;width:0;border:none;position:absolute">
            <div id="rename-${item.id}"><img src="static/assets/pencil-icon.svg"> Rename</div>
            <hr>
            <div id="trash-${item.id}"><img src="static/assets/trash-icon.svg"> Trash</div>
            <hr>
            <div id="share-${item.id}"><img src="static/assets/share-icon.svg"> Share</div>
        </div>`;
    }
    
    return html;
}

// Override the original showDirectory function
window.showDirectory = sortAndDisplayDirectory;
