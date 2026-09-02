const apiInput = document.getElementById('apiEndpoint');
const subCatSelect = document.getElementById('formSubCategorySelect');
const newSubInput = document.getElementById('newSubCatNameInput');
const tagsContainer = document.getElementById('subCategoryTagsContainer');

let activeMainCategory = 'income';

// NEW: Temporary memory bank to hold your inputs when you switch tabs
let formValueMemory = {
    income: { description: '', amount: '', fees: '0' },
    expense: { description: '', amount: '' },
    tax: { description: '', amount: '', withholding: 'No' }
};

window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('userSheetDB')) {
        apiInput.value = localStorage.getItem('userSheetDB');
    }
    document.getElementById('formDate').valueAsDate = new Date();
    
    if (localStorage.getItem('customSubCatsCache')) {
        window.subCategoriesCache = JSON.parse(localStorage.getItem('customSubCatsCache'));
    }
    
    refreshSubCategoryUI();
    selectMainCategory('income'); // Set default tab to Income on load
    
    setTimeout(() => {
        if (typeof resizeCanvas === 'function') resizeCanvas();
        if (typeof updateMatrixData === 'function') updateMatrixData();
    }, 150);
});

apiInput.addEventListener('input', (e) => {
    localStorage.setItem('userSheetDB', e.target.value);
});

// FIXED: Remembers your numbers perfectly when switching back and forth
function selectMainCategory(categoryName) {
    // 1. SAVE the current inputs into memory before leaving the active tab
    const currentClient = document.getElementById('formClient').value;
    const currentAmount = document.getElementById('formAmount').value;
    
    formValueMemory[activeMainCategory].description = currentClient;
    formValueMemory[activeMainCategory].amount = currentAmount;
    
    if (activeMainCategory === 'income') {
        formValueMemory.income.fees = document.getElementById('formFees').value;
    } else if (activeMainCategory === 'tax') {
        formValueMemory.tax.withholding = document.getElementById('formWithholdingToggle').value;
    }

    // 2. SWITCH the active tab selection
    activeMainCategory = categoryName;
    document.querySelectorAll('.cat-pill').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`catBtn-${categoryName}`).classList.add('active');
    
    // 3. LOAD the saved numbers back into the input fields instantly
    document.getElementById('formClient').value = formValueMemory[categoryName].description;
    document.getElementById('formAmount').value = formValueMemory[categoryName].amount;

    // 4. Update the visual text labels and suggestions dynamically
    const lblDesc = document.getElementById('lblDescription');
    const lblSub = document.getElementById('lblSubCategory');
    const lblAmt = document.getElementById('lblAmount');
    const txtClient = document.getElementById('formClient');
    const txtAmount = document.getElementById('formAmount');

    if (categoryName === 'income') {
        lblDesc.innerText = "Description / Client";
        txtClient.placeholder = "e.g., Website Project Retainer";
        lblSub.innerText = "Income Sub-Category Target";
        lblAmt.innerText = "Invoice Amount (Gross Earnings)";
        txtAmount.placeholder = "Enter gross invoice value...";
        
        document.getElementById('formFees').value = formValueMemory.income.fees;
    } else if (categoryName === 'expense') {
        lblDesc.innerText = "Expense / Vendor Item";
        txtClient.placeholder = "e.g., Monthly Hosting Bill, Adobe License";
        lblSub.innerText = "Expense Sub-Category Target";
        lblAmt.innerText = "Expense Outflow Cost";
        txtAmount.placeholder = "Enter expense cost...";
    } else if (categoryName === 'tax') {
        lblDesc.innerText = "Tax Event Notes";
        txtClient.placeholder = "e.g., Q2 Estimated Payment";
        lblSub.innerText = "Tax Vault Category Target";
        lblAmt.innerText = "Tax Adjustment Amount";
        txtAmount.placeholder = "Enter tax adjustment...";
        
        document.getElementById('formWithholdingToggle').value = formValueMemory.tax.withholding;
    }
    
    document.getElementById('incomeExtraFields').classList.toggle('hidden', categoryName !== 'income');
    document.getElementById('taxExtraFields').classList.toggle('hidden', categoryName !== 'tax');
    
    refreshSubCategoryUI();
}

function refreshSubCategoryUI() {
    const activeList = window.subCategoriesCache[activeMainCategory];
    
    subCatSelect.innerHTML = '';
    activeList.forEach(name => {
        const opt = document.createElement('option');
        opt.value = name;
        opt.innerText = name;
        subCatSelect.appendChild(opt);
    });

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

function deleteSubCategoryByIndex(indexNumber) {
    const activeList = window.subCategoriesCache[activeMainCategory];
    activeList.splice(indexNumber, 1);
    localStorage.setItem('customSubCatsCache', JSON.stringify(window.subCategoriesCache));
    refreshSubCategoryUI();
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
        statusText.style.color = '#f87171'; statusText.innerText = "Error: All transaction details are required!"; return;
    }

    statusText.style.color = '#eab308'; statusText.innerText = "Streaming to Google Cloud...";
    const totals = window.localHistoryTotals;

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
            
            // Clear memory cache for this specific category upon successful push
            formValueMemory[activeMainCategory].description = '';
            formValueMemory[activeMainCategory].amount = '';
            
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
