const apiInput = document.getElementById('apiEndpoint');

// Initialization lifecycle loop hooks
window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('userSheetDB')) {
        apiInput.value = localStorage.getItem('userSheetDB');
    }
    document.getElementById('formDate').valueAsDate = new Date();
    
    // Safety delay to ensure canvas scales before execution run cycles
    setTimeout(() => {
        if (typeof resizeCanvas === 'function') resizeCanvas();
        if (typeof updateMatrixData === 'function') updateMatrixData();
    }, 100);
});

apiInput.addEventListener('input', (e) => {
    localStorage.setItem('userSheetDB', e.target.value);
});

async function sendToGoogleSheets() {
    const endpoint = apiInput.value.trim();
    const statusText = document.getElementById('syncStatus');
    
    if (!endpoint) {
        statusText.style.color = '#f87171'; statusText.innerText = "Error: Paste your Google Web App URL first!"; return;
    }

    const date = document.getElementById('formDate').value;
    const client = document.getElementById('formClient').value.trim();
    const amount = parseFloat(document.getElementById('formAmount').value) || 0;
    const currency = document.getElementById('formCurrency').value;
    const fees = (parseFloat(document.getElementById('formFees').value) || 0) / 100;
    const expenses = parseFloat(document.getElementById('formExpenses').value) || 0;
    const withholding = document.getElementById('formWithholdingToggle').value;
    const withholdingAmt = parseFloat(document.getElementById('formWithholdingAmt').value) || 0;

    if (!client || amount <= 0) {
        statusText.style.color = '#f87171'; statusText.innerText = "Error: Client Name & Invoice Amount are required!"; return;
    }

    statusText.style.color = '#eab308'; statusText.innerText = "Streaming to Google Cloud...";

    // Access dynamic shared memory scopes safely across modules
    const totals = window.localHistoryTotals;
    totals.gross += amount * (1 - fees);
    totals.expenses += expenses;
    if (withholding === "Yes") {
        totals.taxWithheld += withholdingAmt;
    }

    const payload = {
        data: {
            "Date": date, "Client Name": client, "Invoice Amount": amount, "Currency Recieved": currency,
            "Platform Fees": fees, "Business Expenses": expenses, "Withholding Tax Deducted?": withholding, "Withholding Amount": withholdingAmt
        }
    };

    try {
        const response = await fetch(endpoint, { method: 'POST', body: JSON.stringify(payload) });
        const result = await response.json();

        if (result.status === "success") {
            statusText.style.color = '#4ade80';
            statusText.innerText = "✔ Success! Row logged into Google Sheets.";
            document.getElementById('formClient').value = '';
            document.getElementById('formAmount').value = '';
            
            // Trigger visual refresh inside matrix-engine module context
            if (typeof updateMatrixData === 'function') updateMatrixData(); 
        } else {
            throw new Error(result.message);
        }
    } catch (err) {
        statusText.style.color = '#f87171'; statusText.innerText = "Connection Failed. Check your Deployment Web App URL.";
    }
}
