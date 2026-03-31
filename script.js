// --- 1. ระบบ Sidebar & UI พื้นฐาน ---
function toggleMenu() {
    const menu = document.getElementById("menu");
    const overlay = document.getElementById("overlay");
    menu.classList.toggle("active");
    if (menu.classList.contains("active")) {
        overlay.style.display = "block";
        setTimeout(() => overlay.classList.add("active"), 10);
    } else {
        overlay.classList.remove("active");
        setTimeout(() => overlay.style.display = "none", 300);
    }
}

// เลื่อนไปยังส่วนต่างๆ ของหน้าเว็บ
function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        if (document.getElementById("menu").classList.contains("active")) {
            toggleMenu(); // ปิดเมนูก่อนถ้าเปิดอยู่
        }
        window.scrollTo({
            top: element.offsetTop - 80,
            behavior: "smooth"
        });
    }
}

function openAuth(type) {
    if (document.getElementById("menu").classList.contains("active")) {
        toggleMenu();
    }
    document.getElementById('authOverlay').style.display = 'flex';
    switchTab(type);
}

function closeAuth() {
    document.getElementById('authOverlay').style.display = 'none';
}

function switchTab(type) {
    const tabLogin = document.getElementById('tab-login');
    const tabReg = document.getElementById('tab-register');
    const formLogin = document.getElementById('loginForm');
    const formReg = document.getElementById('registerForm');

    if (type === 'login') {
        tabLogin.classList.add('active');
        tabReg.classList.remove('active');
        formLogin.classList.add('active');
        formReg.classList.remove('active');
    } else {
        tabReg.classList.add('active');
        tabLogin.classList.remove('active');
        formReg.classList.add('active');
        formLogin.classList.remove('active');
    }
}

// --- 2. ระบบจำลองฐานข้อมูล ---

document.getElementById('registerForm').onsubmit = function(e) {
    e.preventDefault();
    const user = document.getElementById('r-user').value.trim();
    const email = document.getElementById('r-email').value.trim();
    const pass = document.getElementById('r-pass').value;
    const confirm = document.getElementById('r-confirm').value;

    if (pass !== confirm) {
        alert("❌ รหัสผ่านไม่ตรงกัน!");
        return;
    }

    if (localStorage.getItem('user_' + user)) {
        alert("❌ ชื่อผู้ใช้งานนี้ถูกใช้ไปแล้ว");
        return;
    }

    const userData = { user, email, pass, credits: 500 }; 
    localStorage.setItem('user_' + user, JSON.stringify(userData));
    alert("✅ สมัครสมาชิกสำเร็จ! (ได้รับ 500 เครดิตทดลอง)");
    switchTab('login');
};

document.getElementById('loginForm').onsubmit = function(e) {
    e.preventDefault();
    const userIn = document.getElementById('l-user').value.trim();
    const passIn = document.getElementById('l-pass').value;

    const storedData = localStorage.getItem('user_' + userIn);
    if (storedData) {
        const user = JSON.parse(storedData);
        if (user.pass === passIn) {
            alert("🎉 ยินดีต้อนรับคุณ " + user.user);
            localStorage.setItem('session', user.user);
            location.reload();
        } else {
            alert("❌ รหัสผ่านไม่ถูกต้อง");
        }
    } else {
        alert("❌ ไม่พบชื่อผู้ใช้งานนี้");
    }
};

function buyProduct(name, price) {
    const session = localStorage.getItem('session');
    if (!session) {
        alert("⚠️ กรุณาเข้าสู่ระบบก่อนซื้อสินค้า");
        openAuth('login');
        return;
    }

    let userData = JSON.parse(localStorage.getItem('user_' + session));
    if (userData.credits >= price) {
        userData.credits -= price;
        localStorage.setItem('user_' + session, JSON.stringify(userData));
        alert(`✅ ซื้อ ${name} สำเร็จ!\nคงเหลือ ${userData.credits} เครดิต`);
        location.reload(); 
    } else {
        alert("❌ เครดิตไม่เพียงพอ!");
    }
}

function logout() {
    localStorage.removeItem('session');
    location.reload();
}

// --- 3. ระบบอัปเดต UI ---
function checkLogin() {
    const session = localStorage.getItem('session');
    const authSection = document.getElementById('authSection');
    
    if (session && authSection) {
        const userData = JSON.parse(localStorage.getItem('user_' + session));
        authSection.innerHTML = `
            <div class="user-profile-box" style="background:#1e293b; padding:20px; border-radius:15px; border:1px solid #e60023; text-align:center; margin-top:20px; width:100%;">
                <p style="color:#94a3b8; font-size:12px;">โปรไฟล์ผู้ใช้งาน</p>
                <h2 style="margin:5px 0; color:#fff;">👤 ${userData.user}</h2>
                <p style="color:#facc15; font-weight:bold; margin-bottom:15px; font-size:18px;">💰 ยอดเงิน: ${userData.credits.toLocaleString()} เครดิต</p>
                <button onclick="logout()" style="background:#e60023; color:white; border:none; padding:10px; width:100%; border-radius:8px; cursor:pointer; font-weight:bold;">ออกจากระบบ</button>
            </div>
        `;
    }
}

function animate(id, target) {
    let el = document.getElementById(id);
    if (!el) return;
    let duration = 2000;
    let fps = 120;
    let steps = duration / (1000 / fps);
    let increment = target / steps;
    let current = 0;
    let timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.innerText = Math.floor(current).toLocaleString();
    }, 1000 / fps);
}

document.addEventListener("DOMContentLoaded", () => {
    animate("user", 1);
    animate("product", 0);
    animate("stock", 0);
    animate("sold", 0);
    checkLogin();
});

window.onclick = function(event) {
    if (event.target == document.getElementById('authOverlay')) closeAuth();
}
