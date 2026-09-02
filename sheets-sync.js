const apiInput = document.getElementById('apiEndpoint');
const subCatSelect = document.getElementById('formSubCategorySelect');
const newSubInput = document.getElementById('newSubCatNameInput');
const tagsContainer = document.getElementById('subCategoryTagsContainer');

// Local tracking state configuration for active category pill button
let activeMainCategory = 'income';

window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('userSheetDB')) {
        apiInput.value = localStorage.getItem('userSheetDB');
    }
    document.getElementById('formDate').valueAsDate = new Date();
    
    // Load custom sub-categories from memory pool if they exist
    if (localStorage.getItem('customSubCatsCache')) {
        window.subCategoriesCache = JSON.parse(localStorage.getItem('customSubCatsCache'));
    }
    
    refreshSubCategoryUI(); // Build initial layout list options
    
    setTimeout(() => {
        if (typeof resizeCanvas === 'function') resizeCanvas();
        if (typeof updateMatrixData === 'function') updateMatrixData();
    }, 150);
});

apiInput.addEventListener('input', (e) => {
    localStorage.setItem('userSheetDB', e.target.value);
});

// FIXED: Handles switching category pill selectors displayed directly on form layout
function selectMainCategory(categoryName) {
    activeMainCategory = categoryName;
    
    // Update visual button active class highlights
    document.querySelectorAll('.cat-pill').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`catBtn-${categoryName}`).classList.add('active');
    
    // Toggle input field container dependencies
    document.getElementById('incomeExtraFields').classList.toggle('hidden', categoryName !== 'income');
    document.getElementById('taxExtraFields').classList.toggle('hidden', categoryName !== 'tax');
    
    refreshSubCategoryUI();
}

// FIXED: Re-compiles dropdown choices and matching edit tags inside the manager box
function refreshSubCategoryUI() {
    const activeList = window.subCategoriesCache[activeMainCategory];
    
    // 1. Rebuild standard selector options
    subCatSelect.innerHTML = '';
    activeList.forEach(name => {
        const opt = document.createElement('option');
        opt.value = name;
        opt.innerText = name;
        subCatSelect.appendChild(opt);
    });

    // 2. Rebuild editable delete tag cloud blocks
    tagsContainer.innerHTML = '';
    activeList.forEach((name, idx) => {
        const tag = document.createElement('div');
        tag.className = 'subcat-tag';
        tag.innerHTML = `
            <span>${name}</span>
            <button type="button" onclick="deleteSubCategoryByIndex(${idx})">×</button>
        `;
        tagsContainer.appendChild(tag);
    });
}

// FIXED: Saves a brand new custom sub-category value into configuration memory state
function addNewSubCategoryFromSidebar() {
    const rawVal = newSubInput.value.trim();
    if (!rawVal) return;

    if (!window.subCategoriesCache[activeMainCategory].includes(rawVal)) {
        window.subCategoriesCache[activeMainCategory].push(rawVal);
        localStorage.setItem('customSubCatsCache', JSON.stringify(window.subCategoriesCache));
        newSubInput.value = '';
        refreshSubCategoryUI();
    }
}

// FIXED: Deletes a sub-category directly from the ledger management tag cluster
function deleteSubCategoryByIndex(indexNumber) {
    const activeList = window.subCategoriesCache[activeMainCategory];
    activeList.splice(indexNumber, 1);
    localStorage.setItem('customSubCatsCache', JSON.stringify(window.subCategoriesCache));
    refreshSubCategoryUI();
    
    // Refresh right dashboard values immediately to update graphs
    if (typeof updateMatrixData === 'function') updateMatrixData();
}

async function sendToGoogleSheets() {
    const endpoint = apiInput.value.trim();
    const statusText = document.getElementById('syncStatus');
    
    if (!endpoint) {
        statusText.style.color = '#f87171'; statusText.innerText = "Error: Paste your Google Web App URL first!"; return;
    }

    const date = document.getElementById('formDate').value;
    const client = document.getElementById('formClient').value.trim();
    const amount = parseFloat(document.getElementById('formAmount').value) || 0;
    const subCat = subCatSelect.value;

    const fees = (parseFloat(document.getElementById('formFees').value) || 0) / 100;
    const withholding = document.getElementById('formWithholdingToggle').value;
    const withholdingAmt = parseFloat(document.getElementById('formWithholdingAmt').value) || 0;

    if (!client || amount <= 0 || !subCat) {
        statusText.style.color = '#f87171'; statusText.innerText = "Error: Description, Amount & Sub-Category are required!"; return;
    }

    statusText.style.color = '#eab308'; statusText.innerText = "Streaming to Google Cloud...";
    const totals = window.localHistoryTotals;

    // Reset fallback sandbox mock items upon first transaction logging sequence
    if (totals.gross === 0 && Object.keys(totals.breakdownValues).length <= 7) {
        totals.breakdownValues = {};
    }

    if (!totals.breakdownValues[subCat]) totals.breakdownValues[subCat] = 0;
    totals.breakdownValues[subCat] += amount;

    if (activeMainCategory === 'income') {
        totals.gross += amount * (1 - fees);
    } else if (activeMainCategory === 'expense') {
        totals.expenses += amount;
    } else if (activeMainCategory === 'tax') {
        totals.taxWithheld += withholdingAmt;
    }

    const payload = {
        data: {
            "Date": date, "Client Name": client, "Invoice Amount": amount, "Category": activeMainCategory,
            "Sub Category": subCat, "Platform Fees": fees, "Withholding Tax Deducted?": withholding, "Withholding Amount": withholdingAmt
        }
    };

    try {
        const response = await fetch(endpoint, { method: 'POST', body: JSON.stringify(payload) });
        const result = await response.json();

        if (result.status === "success") {
            statusText.style.color = '#4ade80';
            statusText.innerText = "✔ Success! Row logged to Google Sheets.";
            document.getElementById('formClient').value = '';
            document.getElementById('formAmount').value = '';
            if (typeof updateMatrixData === 'function') updateMatrixData(); 
        } else {
            throw new Error(result.message);
        }
    } catch (err) {
        statusText.style.color = '#f87171'; statusText.innerText = "Connection Failed. Check your Deployment Web App URL.";
    }
}
