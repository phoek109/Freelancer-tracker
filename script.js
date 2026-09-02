let currentCurrency = '$';

const inputRevenue = document.getElementById('inputRevenue');
const inputRatio = document.getElementById('inputRatio');
const inputTaxRate = document.getElementById('inputTaxRate');
const canvas = document.getElementById('flowChart');

function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
}

function drawBackgroundGrid(ctx, w, h) {
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.25)';
    ctx.lineWidth = 1;
    
    for (let x = 0; x < w; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
    }
}

function drawFlowLines(expRatio, taxRate, netProfit, gross) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const w = canvas.width;
    const h = canvas.height;

    drawBackgroundGrid(ctx, w, h);

    const startX = 140; // Shifted right to leave room for the incoming Gross line
    const startY = h / 2;
    const endX = w - 160; 

    const taxFactor = netProfit > 0 ? (netProfit * taxRate / gross) : 0;
    const endY_Expenses = startY - (expRatio * (h * 0.35));
    const endY_Tax = startY;
    const endY_TakeHome = startY + ((1 - expRatio - taxFactor) * (h * 0.35));

    const expPercent = Math.round(expRatio * 100);
    const taxPercent = Math.round(taxRate * 100);
    const homePercent = Math.round((1 - expRatio - taxFactor) * 100);

    // --- NEW: 1. Render the Incoming Gross Income Stream ---
    // Ambient back-glow for Gross
    ctx.beginPath();
    ctx.moveTo(0, startY);
    ctx.lineTo(startX, startY);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 14;
    ctx.globalAlpha = 0.05;
    ctx.stroke();

    // Crisp core wire for Gross
    ctx.globalAlpha = 1.0;
    ctx.lineWidth = 4;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#38bdf8';
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Gross Pill-shaped label at the very left edge
    ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
    const grossText = "GROSS INCOME";
    const grossPillW = ctx.measureText(grossText).width + 16;
    const grossPillH = 20;
    
    ctx.beginPath();
    ctx.roundRect(10, startY - (grossPillH / 2), grossPillW, grossPillH, grossPillH / 2);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1;
    ctx.fill();
    ctx.stroke();
    
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(grossText, 18, startY + 4);

    // --- 2. Render Branch Outgoing Custom Curves ---
    function drawCurve(endY, color, baseText, percentValue) {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.bezierCurveTo(startX + (w * 0.25), startY, endX - (w * 0.25), endY, endX, endY);
        ctx.strokeStyle = color;
        ctx.lineWidth = 14;
        ctx.globalAlpha = 0.05;
        ctx.stroke();

        ctx.globalAlpha = 1.0;
        ctx.lineWidth = 4;
        ctx.shadowBlur = 10;
        ctx.shadowColor = color;
        ctx.stroke();
        ctx.shadowBlur = 0;

        const labelText = `${baseText} (${percentValue}%)`;
        ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
        const textWidth = ctx.measureText(labelText).width;
        
        const pillW = textWidth + 24;
        const pillH = 22;
        const pillX = endX;
        const pillY = endY - (pillH / 2);

        ctx.beginPath();
        ctx.roundRect(pillX, pillY, pillW, pillH, pillH / 2);
        ctx.fillStyle = color;
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.fillText(labelText, pillX + 12, pillY + 15);
    }

    drawCurve(endY_Expenses, '#ef4444', 'Expenses', expPercent);
    drawCurve(endY_Tax, '#eab308', 'Tax Reserve', taxPercent);
    drawCurve(endY_TakeHome, '#22c55e', 'Take-Home', homePercent);

    // 3. Outer dashed connection ring frame
    ctx.beginPath();
    ctx.arc(startX, startY, 20, 0, Math.PI * 2);
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]); 
    ctx.stroke();
    ctx.setLineDash([]); 

    // 4. Primary solid connection core node button
    ctx.beginPath();
    ctx.arc(startX, startY, 13, 0, Math.PI * 2);
    ctx.fillStyle = '#3b82f6';
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#3b82f6';
    ctx.fill();
    ctx.shadowBlur = 0;

    // 5. Inject Currency character symbol
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(currentCurrency, startX, startY + 4);
    ctx.textAlign = 'left'; 
}

function updateMatrixData() {
    const gross = parseFloat(inputRevenue.value) || 0;
    const expRatio = (parseFloat(inputRatio.value) || 0) / 100;
    const taxRate = (parseFloat(inputTaxRate.value) || 0) / 100;

    const totalExpenses = gross * expRatio;
    const netProfit = gross - totalExpenses;
    const taxReserve = netProfit > 0 ? netProfit * taxRate : 0;
    const takeHome = netProfit - taxReserve;

    const software = totalExpenses * 0.4;
    const marketing = totalExpenses * 0.35;
    const hardware = totalExpenses * 0.25;

    document.getElementById('valRevenue').innerText = `${currentCurrency}${gross.toLocaleString()}`;
    document.getElementById('valRatio').innerText = `${inputRatio.value}%`;
    document.getElementById('valTaxRate').innerText = `${inputTaxRate.value}%`;

    document.getElementById('grossDisplay').innerText = `${currentCurrency}${gross.toLocaleString()}`;
    document.getElementById('expensesDisplay').innerText = `${currentCurrency}${totalExpenses.toLocaleString(undefined, {maximumFractionDigits:0})}`;
    document.getElementById('taxDisplay').innerText = `${currentCurrency}${taxReserve.toLocaleString(undefined, {maximumFractionDigits:0})}`;
    // NEW: Linked the Take-Home metric calculation text element here
    document.getElementById('takeHomeDisplay').innerText = `${currentCurrency}${takeHome.toLocaleString(undefined, {maximumFractionDigits:0})}`;

    document.getElementById('expSoftware').innerText = `${currentCurrency}${software.toLocaleString(undefined, {maximumFractionDigits:0})}`;
    document.getElementById('expMarketing').innerText = `${currentCurrency}${marketing.toLocaleString(undefined, {maximumFractionDigits:0})}`;
    document.getElementById('expHardware').innerText = `${currentCurrency}${hardware.toLocaleString(undefined, {maximumFractionDigits:0})}`;

    if (gross > 0) {
        document.getElementById('barExpenses').style.width = `${(totalExpenses / gross) * 100}%`;
        document.getElementById('barTax').style.width = `${(taxReserve / gross) * 100}%`;
        document.getElementById('barTakeHome').style.width = `${(takeHome / gross) * 100}%`;
    }

    drawFlowLines(expRatio, taxRate, netProfit, gross);
}

inputRevenue.addEventListener('input', updateMatrixData);
inputRatio.addEventListener('input', updateMatrixData);
inputTaxRate.addEventListener('input', updateMatrixData);

document.querySelectorAll('.curr-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.curr-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentCurrency = e.target.getAttribute('data-symbol');
        updateMatrixData();
    });
});

window.onload = () => {
    resizeCanvas();
    updateMatrixData();
};

window.onresize = () => {
    resizeCanvas();
    updateMatrixData();
};
