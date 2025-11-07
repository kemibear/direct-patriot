document.addEventListener('DOMContentLoaded', () => {
    const loginScreen = document.getElementById('login-screen');
    const dashboardScreen = document.getElementById('dashboard-screen');
    const loginForm = document.getElementById('login-form');
    const transferForm = document.getElementById('transfer-form');
    const balanceEl = document.getElementById('balance');
    const transactionsList = document.getElementById('transactions-list');
    const profileImg = document.getElementById('profile-img');
    const logoutBtn = document.getElementById('logout-btn');
    const photoUpload = document.getElementById('photo-upload');
    const yearSpan = document.getElementById('year');

    const initialBalance = 488111.80;
    let defaultUser = {
        username: 'wesselbeckenbauer@outlook.com',
        password: 'securepatriot1011',
        name: 'Wessel Beckenbauer',
        account: 'XXXX-XXXX-9382'
    };


    const initialTransactions = [
        { date: '2025-08-04', desc: 'Investment - Vanguard Bitcoin ETF', amount: +20500.00, type: 'credit' },
        { date: '2025-08-03', desc: 'Groceries - Whole Foods', amount: -250.95, type: 'debit' },
        { date: '2025-08-15', desc: 'Medical Supplies - CVS', amount: -500.50, type: 'debit' },
        { date: '2025-08-21', desc: 'Dividend Income - AAPL', amount: +8300.00, type: 'credit' },
        { date: '2025-09-30', desc: 'Utilities - Electric Bill', amount: -380.60, type: 'debit' },
        { date: '2025-10-01', desc: 'Bitcoin-Purchase', amount: -8500.00, type: 'debit' },
        { date: '2025-10-02', desc: 'Dinner & Tax - Wren & Wolf', amount: -123.89, type: 'debit' },
        { date: '2025-10-04', desc: 'Travel Supplies - Trader Joe’s', amount: -2300.80, type: 'debit' }
    ];

    //Run below line to clear local storage transactions
    //localStorage.removeItem('transactions');

    let balance = parseFloat(localStorage.getItem('balance')) || initialBalance;
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [...initialTransactions];
    let profilePhoto = localStorage.getItem('profile') || './pofile image/profile.jpg';

    yearSpan.textContent = new Date().getFullYear();

    function updateBalance() {
        balanceEl.textContent = `$${balance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
        localStorage.setItem('balance', balance);
    }

    function renderTransactions() {
        transactionsList.innerHTML = '';
        transactions.slice().reverse().forEach(t => {
            const div = document.createElement('div');
            div.className = 'transaction';
            div.innerHTML = `
                <div>
                    <div class="desc">${t.desc}</div>
                    <div class="date">${formatDate(t.date)}</div>
                </div>
                <div class="amount ${t.amount > 0 ? 'positive' : 'negative'}">
                    ${t.amount > 0 ? '+' : ''}$${Math.abs(t.amount).toFixed(2)}
                </div>
            `;
            transactionsList.appendChild(div);
        });
    }

    function formatDate(dateStr) {
        const date = new Date(dateStr + 'T12:00:00');
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        if (username === defaultUser.username && password === defaultUser.password) {
            loginScreen.classList.remove('active');
            dashboardScreen.classList.add('active');
            loadDashboard();
        } else {
            alert('Your account has been temporarily suspended. We detected a suspicious login and have restricted access for your security. To restore full access, please visit any branch with a valid photo ID, proof of address (such as a utility bill), and this security reference: [SEC-REF-285620]. For assistance, kindly contact your account manager for assistance, and never share your passwords or OTPs with anyone.');
        }
    });

    function loadDashboard() {
        updateBalance();
        renderTransactions();
        profileImg.src = profilePhoto;
    }

    transferForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const recipient = document.getElementById('recipient').value.trim();
        const amount = parseFloat(document.getElementById('amount').value);
        const note = document.getElementById('note').value.trim();

        if (amount <= 0 || amount > balance) {
            alert('Invalid amount or insufficient funds.');
            return;
        }

        balance -= amount;
        const newTx = {
            date: new Date().toISOString().split('T')[0],
            desc: `Transfer to ${recipient}${note ? ' - ' + note : ''}`,
            amount: -amount,
            type: 'debit'
        };
        transactions.push(newTx);
        localStorage.setItem('transactions', JSON.stringify(transactions));
        updateBalance();
        renderTransactions();
        transferForm.reset();
        alert(`$${amount.toFixed(2)} sent to ${recipient}.`);
    });

    logoutBtn.addEventListener('click', () => {
        dashboardScreen.classList.remove('active');
        loginScreen.classList.add('active');
        loginForm.reset();
    });

    updateBalance();
    renderTransactions();
});
