const icon = document.querySelector('.mobile-nav .logo .fa-bars');
const closeIcon = document.querySelector('.mobile-nav .logo .fa-xmark')
const mobileMenu = document.querySelector('.mobile-nav .tags');
const mobileNav = document.querySelector('.mobile-nav');
const mobileMenuItems = mobileMenu.querySelectorAll('.mobile-nav .tags li a');

icon.addEventListener('click', () => {
    mobileMenu.style.display="flex";

    icon.style.display='none';
    closeIcon.style.display='inline';

    mobileMenu.style.boxShadow=' inset 0 0 1rem #ccc';
    mobileNav.style.height='16rem';
    console.log("clicked");
});

closeIcon.addEventListener('click',()=>{
    mobileMenu.style.display="none";
    icon.style.display='inline';
    closeIcon.style.display='none';
    mobileNav.style.boxShadow='none'
    mobileNav.style.height='4rem';
    console.log("closed");

});
   

mobileMenuItems.forEach((item) => {
    item.addEventListener('click', () => {
        mobileMenu.style.display="none";
        mobileNav.style.height='4rem';
        icon.style.display='inline';
    closeIcon.style.display='none';
    });
});


    window.addEventListener("load", () => {
        const loader = document.querySelector(".loader");
      
        loader.classList.add("loader--hidden");
      
        loader.addEventListener("transitionend", () => {
          document.body.removeChild(loader);
        });
      });
      




  document.addEventListener('DOMContentLoaded', function() {


    document.getElementById('loanType').addEventListener('change', updateInterestRate);
    document.getElementById('loanAmount').addEventListener('input', updateInterestRate);
    document.getElementById('loanTerm').addEventListener('input', updateInterestRate);
    document.getElementById('termType').addEventListener('change', updateInterestRate);
});

function updateInterestRate() {
    const loanType = document.getElementById('loanType').value;
    const loanAmount = parseFloat(document.getElementById('loanAmount').value) || 0;
    let loanTerm = parseInt(document.getElementById('loanTerm').value) || 0;
    const termType = document.getElementById('termType').value;
   
    if (termType === 'years') {
        loanTerm = loanTerm * 12;
    }
    
    if (!loanType || loanAmount <= 0 || loanTerm <= 0) {
        document.getElementById('calculatedRate').value = '';
        return;
    }
    
    
    let rate = calculateInterestRate(loanType, loanAmount, loanTerm);
    document.getElementById('calculatedRate').value = rate.toFixed(2);
}

function calculateInterestRate(loanType, amount, termInMonths) {
    
    let baseRate = 0;
    
    switch(loanType) {
        case 'personal':
            baseRate = 12.5;
           
            if (amount > 25000) baseRate -= 0.5;
            if (amount > 50000) baseRate -= 0.5;
            
          
            if (termInMonths <= 12) baseRate -= 0.75;
            else if (termInMonths <= 36) baseRate -= 0.25;
            else if (termInMonths > 60) baseRate += 0.5;
            break;
            
        case 'auto':
            baseRate = 7.5;
         
            if (amount > 30000) baseRate -= 0.25;
            if (amount > 50000) baseRate -= 0.25;
            
      
            if (termInMonths <= 36) baseRate -= 0.5;
            else if (termInMonths > 60) baseRate += 0.75;
            break;
            
        case 'business':
            baseRate = 10.0;
       
            if (amount > 50000) baseRate -= 0.5;
            if (amount > 100000) baseRate -= 0.5;
            

            if (termInMonths <= 24) baseRate -= 0.25;
            else if (termInMonths > 60) baseRate += 1.0;
            break;
    }
    

    return Math.max(3.0, Math.min(baseRate, 18.0));
}

document.getElementById('loanForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
   document.querySelector('body').style.overflow = 'hidden';
    calculateLoan();

});
document.getElementById('Send-loan-req').addEventListener('click', function(e) {
    document.querySelector('.loan-req-sent').style.display = 'flex';

});



function calculateLoan() {
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const loanType = document.getElementById('loanType').value;
    const loanAmount = parseFloat(document.getElementById('loanAmount').value);
    let loanTerm = parseInt(document.getElementById('loanTerm').value);
    const termType = document.getElementById('termType').value;
    const startDate = new Date(document.getElementById('startDate').value);
    
    // Convert years to months if needed
    if (termType === 'years') {
        loanTerm = loanTerm * 12;
    }
    
    // Calculate interest rate
    const interestRate = calculateInterestRate(loanType, loanAmount, loanTerm);
    
    // Calculate monthly rate and payment
    const monthlyRate = interestRate / 100 / 12;
    const monthlyPayment = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTerm) / (Math.pow(1 + monthlyRate, loanTerm) - 1);
    const totalPayment = monthlyPayment * loanTerm;
    const totalInterest = totalPayment - loanAmount;
    
    // Set first payment date (1 month after start date)
    const firstPaymentDate = new Date(startDate);
    firstPaymentDate.setMonth(firstPaymentDate.getMonth() + 1);
    
    // Set last payment date
    const lastPaymentDate = new Date(firstPaymentDate);
    lastPaymentDate.setMonth(lastPaymentDate.getMonth() + loanTerm - 1);
    
    // Format dates
    const formattedFirstPayment = formatDate(firstPaymentDate);
    const formattedLastPayment = formatDate(lastPaymentDate);
    
    // Get loan type display name
    const loanTypeDisplay = {
        'personal': 'Personal Loan',
        'auto': 'Auto Loan',
        'business': 'Business Loan'
    }[loanType];
    
    // Update the results
    document.getElementById('resultName').textContent = name;
    document.getElementById('resultEmail').textContent = email;
    document.getElementById('resultPhone').textContent = phone || 'Not provided';
    document.getElementById('resultLoanType').textContent = loanTypeDisplay;
    document.getElementById('resultAmount').textContent = loanAmount.toFixed(2);
    document.getElementById('resultTerm').textContent = loanTerm + ' months';
    document.getElementById('resultRate').textContent = interestRate.toFixed(2);
    document.getElementById('monthlyPayment').textContent = monthlyPayment.toFixed(2);
    document.getElementById('totalPayment').textContent = totalPayment.toFixed(2);
    document.getElementById('totalInterest').textContent = totalInterest.toFixed(2);
    document.getElementById('firstPaymentDate').textContent = formattedFirstPayment;
    document.getElementById('lastPaymentDate').textContent = formattedLastPayment;
    
    // Generate amortization schedule
    generateAmortizationTable(loanAmount, monthlyRate, monthlyPayment, loanTerm, firstPaymentDate);
    
    // Show results
    document.getElementById('results').style.display = 'block';
}

function generateAmortizationTable(principal, monthlyRate, monthlyPayment, term, firstPaymentDate) {
    const tableBody = document.getElementById('amortizationBody');
    tableBody.innerHTML = '';
    
    let balance = principal;
    let paymentDate = new Date(firstPaymentDate);
    
    for (let i = 1; i <= term; i++) {
        const interestPayment = balance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        balance -= principalPayment;
        
        if (balance < 0.01) balance = 0; // Prevent tiny negative balances due to rounding
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${i}</td>
            <td>${formatDate(paymentDate)}</td>
            <td>$${monthlyPayment.toFixed(2)}</td>
            <td>$${interestPayment.toFixed(2)}</td>
            <td>$${balance.toFixed(2)}</td>
            <td>$${principalPayment.toFixed(2)}</td>
        `;
        
        tableBody.appendChild(row);
        
        // Increment date by 1 month for next payment
        paymentDate.setMonth(paymentDate.getMonth() + 1);
    }
}

function formatDate(date) {
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

