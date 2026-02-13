let user = localStorage.getItem('temp_user') || ""; // Cek apakah ada email lama
let domain = localStorage.getItem('temp_domain') || "1secmail.com";
let refreshInterval;

// Fungsi yang dijalankan otomatis saat web dibuka
window.onload = function() {
    if (user) {
        // Jika ada email lama di memori, pakai itu
        document.getElementById('email-display').innerText = `${user}@${domain}`;
        startChecking();
    } else {
        // Jika tidak ada, buat baru otomatis (Asep/Rudi)
        generateRandomAsep();
    }
};

function generateRandomAsep() {
    const names = ["asep", "rudi", "kang_asep", "mang_rudi"];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomNum = Math.floor(Math.random() * 1000);
    
    updateEmail(randomName + randomNum, "1secmail.com");
}

function setCustomEmail() {
    const inputName = document.getElementById('custom-name').value.trim();
    if (inputName.length < 3) return alert("Nama kependekan!");
    
    const cleanName = inputName.toLowerCase().replace(/[^a-z0-9._]/g, "");
    updateEmail(cleanName, document.getElementById('domain-select').value);
}

function updateEmail(newName, newDomain) {
    user = newName;
    domain = newDomain;
    
    // SIMPAN KE MEMORI BROWSER
    localStorage.setItem('temp_user', user);
    localStorage.setItem('temp_domain', domain);
    
    document.getElementById('email-display').innerText = `${user}@${domain}`;
    document.getElementById('mail-list').innerHTML = '<li class="empty-msg">Menunggu email masuk...</li>';
    
    startChecking();
}

function startChecking() {
    clearInterval(refreshInterval);
    refreshInterval = setInterval(checkInbox, 5000);
    checkInbox();
}

async function checkInbox() {
    if (!user) return;
    try {
        // Pastikan URL ini sesuai dengan path Netlify Function kamu
        const response = await fetch(`/.netlify/functions/api?action=getMessages&login=${user}&domain=${domain}`);
        const data = await response.json();
        
        const list = document.getElementById('mail-list');
        if (data && data.length > 0) {
            list.innerHTML = "";
            data.forEach(mail => {
                const li = document.createElement('li');
                li.className = 'mail-item';
                li.innerHTML = `<strong>${mail.from}</strong><br>${mail.subject}`;
                li.onclick = () => readMail(mail.id);
                list.appendChild(li);
            });
        }
    } catch (e) {
        console.log("Koneksi API terputus, mencoba lagi...");
    }
}
