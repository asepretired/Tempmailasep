let user = "";
let domain = "1secmail.com"; // Domain aktif agar email bisa masuk
let refreshInterval;

function generateCustomEmail() {
    const names = ["asep", "rudi", "mang_asep", "kang_rudi", "asep_ganteng"];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomNum = Math.floor(Math.random() * 10000); // Angka acak agar unik
    
    user = `${randomName}.${randomNum}`;
    const emailFull = `${user}@${domain}`;
    
    document.getElementById('email-display').innerText = emailFull;
    
    // Reset inbox
    document.getElementById('mail-list').innerHTML = '<li class="empty-msg">Menunggu email masuk...</li>';
    
    // Mulai cek inbox
    clearInterval(refreshInterval);
    refreshInterval = setInterval(checkInbox, 5000); // Cek tiap 5 detik
    checkInbox(); // Cek langsung sekali
}

async function checkInbox() {
    if (!user) return;
    
    document.getElementById('loading-spinner').style.display = 'inline';
    
    try {
        // Kita panggil via Netlify Function untuk hindari error CORS
        const response = await fetch(`/api?action=getMessages&login=${user}&domain=${domain}`);
        const data = await response.json();
        
        const list = document.getElementById('mail-list');
        
        if (data.length > 0) {
            list.innerHTML = ""; // Bersihkan pesan kosong
            data.forEach(mail => {
                const li = document.createElement('li');
                li.className = 'mail-item';
                li.innerHTML = `<strong>${mail.from}</strong><br>${mail.subject}`;
                li.onclick = () => readMail(mail.id);
                list.appendChild(li);
            });
            document.getElementById('status-text').innerText = `Ada ${data.length} pesan`;
        } else {
            // Jangan refresh HTML kalau kosong biar gak kedip
             document.getElementById('status-text').innerText = "Belum ada pesan baru";
        }
    } catch (error) {
        console.error("Gagal mengambil email", error);
    } finally {
        document.getElementById('loading-spinner').style.display = 'none';
    }
}

async function readMail(id) {
    try {
        const response = await fetch(`/api?action=readMessage&login=${user}&domain=${domain}&id=${id}`);
        const data = await response.json();
        
        document.getElementById('modal-subject').innerText = data.subject;
        document.getElementById('modal-from').innerText = data.from;
        document.getElementById('modal-date').innerText = data.date;
        document.getElementById('modal-body').innerHTML = data.htmlBody || data.body; // Prioritas HTML body
        
        document.getElementById('email-modal').style.display = "block";
    } catch (e) {
        alert("Gagal membuka pesan.");
    }
}

function closeModal() {
    document.getElementById('email-modal').style.display = "none";
}

function copyEmail() {
    const text = document.getElementById('email-display').innerText;
    navigator.clipboard.writeText(text).then(() => {
        alert("Email Asep/Rudi berhasil disalin!");
    });
}

// Generate otomatis saat web dibuka
window.onload = generateCustomEmail;
