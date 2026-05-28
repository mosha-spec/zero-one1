document.addEventListener("DOMContentLoaded", () => {
    // 1. تعريف العناصر الأساسية
    const openBtn = document.getElementById("openBtn");
    const splashScreen = document.getElementById("splashScreen");
    const doorContainer = document.getElementById("doorContainer");
    const mainCard = document.getElementById("mainCard");
    const bgMusic = document.getElementById("bgMusic");
    const musicBtn = document.getElementById("musicBtn");

    // 2. حدث الضغط على "فتح الدعوة"
    openBtn.addEventListener("click", () => {
        // تشغيل الموسيقى
        bgMusic.play().catch(err => console.log("المتصفح حجب التشغيل التلقائي"));
        
        // إخفاء شاشة البداية بنعومة
        splashScreen.style.opacity = "0";
        setTimeout(() => {
            splashScreen.classList.add("hidden");
            // إظهار الكارت الداخلي
            mainCard.classList.remove("hidden");
            setTimeout(() => mainCard.classList.add("visible"), 50);
            
            // فتح ضلفتين الباب بالملي زي الفيديو
            doorContainer.classList.add("open");
            
            // بدء تساقط أوراق الورد
            startPetalsFalling();
        }, 1000);
    });

    // زر التحكم في الموسيقى (كتم / تشغيل)
    musicBtn.addEventListener("click", () => {
        if (bgMusic.paused) {
            bgMusic.play();
            musicBtn.textContent = "🎵";
        } else {
            bgMusic.pause();
            musicBtn.textContent = "🔇";
        }
    });

    // 3. كود العداد التنازلي (حتى تاريخ 25 ديسمبر 2026)
    const targetDate = new Date("December 25, 2026 16:00:00").getTime();

    const countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
            clearInterval(countdownInterval);
            document.querySelector(".countdown-container").innerHTML = "<h3>الفرح بدأ! منورين يا حبايبنا 🎉</h3>";
            return;
        }

        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);

        document.getElementById("days").textContent = String(d).padStart(2, "0");
        document.getElementById("hours").textContent = String(h).padStart(2, "0");
        document.getElementById("minutes").textContent = String(m).padStart(2, "0");
        document.getElementById("seconds").textContent = String(s).padStart(2, "0");
    }, 1000);

    // 4. كود أنيميشن تساقط أوراق الورد (Petals Falling)
    function startPetalsFalling() {
        const container = document.getElementById("petalsContainer");
        const petalSymbols = ["🌸", "🌹", "🍂", "✨"];
        
        setInterval(() => {
            const petal = document.createElement("div");
            petal.style.position = "absolute";
            petal.style.top = "-20px";
            petal.style.left = Math.random() * 100 + "vw";
            petal.style.fontSize = (Math.random() * 15 + 10) + "px";
            petal.style.animation = `fall ${Math.random() * 3 + 3}s linear forwards`;
            petal.style.opacity = Math.random();
            petal.textContent = petalSymbols[Math.floor(Math.random() * petalSymbols.length)];
            
            container.appendChild(petal);
            
            // إزالة الورقة بعد انتهاء حركتها لتوفير رام الموبايل
            setTimeout(() => petal.remove(), 6000);
        }, 300);
    }

    // 5. كود التوقيع بالإصبع (HTML5 Canvas) متوافق مع شاشات الموبايل
    const canvas = document.getElementById("sigCanvas");
    const ctx = canvas.getContext("2d");
    let drawing = false;

    // ضبط إعدادات القلم
    ctx.strokeStyle = "#2b3a42";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";

    // الحصول على الإحداثيات الصحيحة للمس
    function getTouchPos(canvasDom, touchEvent) {
        const rect = canvasDom.getBoundingClientRect();
        return {
            x: touchEvent.touches[0].clientX - rect.left,
            y: touchEvent.touches[0].clientY - rect.top
        };
    }

    // أحداث اللمس للموبايل
    canvas.addEventListener("touchstart", (e) => {
        drawing = true;
        const pos = getTouchPos(canvas, e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        e.preventDefault();
    });

    canvas.addEventListener("touchmove", (e) => {
        if (!drawing) return;
        const pos = getTouchPos(canvas, e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        e.preventDefault();
    });

    canvas.addEventListener("touchend", () => { drawing = false; });

    // زر مسح التوقيع
    document.getElementById("clearSigBtn").addEventListener("click", () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    // 6. تشغيل دفتر الزوار وإضافة التهاني للقائمة بشكل حي
    const guestForm = document.getElementById("guestbookForm");
    const commentsList = document.getElementById("commentsList");

    guestForm.addEventListener("submit", () => {
        const name = document.getElementById("guestName").value;
        const message = document.getElementById("guestMessage").value;

        // بناء كارت التهنئة الجديد
        const newComment = document.createElement("div");
        newComment.classList.add("comment-card");
        newComment.innerHTML = `
            <div class="comment-header">
                <span class="comment-author">${name}</span>
                <span class="comment-time">الآن</span>
            </div>
            <p class="comment-body">${message}</p>
        `;

        // إدراج التهنئة في أول القائمة
        commentsList.insertBefore(newComment, commentsList.firstChild);

        // تفريغ الخانات ومسح التوقيع
        guestForm.reset();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        alert("شكراً لك! تم إرسال تبريكاتك بنجاح 🤍");
    });
});
