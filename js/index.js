// Variabel Global & URL Google Sheets
const scriptURL =
  "https://script.google.com/macros/s/AKfycbwbvi_NvvgCVE3PjJClEpW3Wlx2STRgDAla1gOshEaEmZjP3LounLndXuJVAZ9nU-bcFA/exec";
const audio = document.getElementById("wedding-audio");
const musicIcon = document.getElementById("music-icon");
let isPlaying = false;

document.body.classList.add("no-scroll");

// Fungsi Utama Buka Undangan
function simpanDanBuka() {
  const inputNama = document.getElementById("input-nama").value;
  const inputContainer = document.getElementById("input-container");
  const welcomeMessage = document.getElementById("welcome-message");
  const displayNama = document.getElementById("display-nama");
  const namaTamuBuku = document.getElementById("nama-tamu-form");
  const mobileNav = document.querySelector(".mobile-nav");

  if (inputNama.trim() !== "") {
    displayNama.innerText = inputNama;
    if (namaTamuBuku) {
      namaTamuBuku.value = inputNama;
    }

    inputContainer.style.opacity = "0";
    setTimeout(() => {
      inputContainer.classList.add("d-none");
      welcomeMessage.classList.remove("d-none");
      welcomeMessage.style.opacity = "1";
    }, 500);

    setTimeout(() => {
      const openingPage = document.getElementById("opening-page");
      openingPage.style.transform = "translateY(-100%)";
      openingPage.style.opacity = "0";
      document.body.classList.remove("no-scroll");
      if (mobileNav) {
        mobileNav.classList.add("show");
      }
      if (audio) {
        audio.play();
        isPlaying = true;
      }
      setTimeout(() => {
        openingPage.style.display = "none";
      }, 1000);
    }, 3000);
  } else {
    Swal.fire({
      title: "Nama Kosong",
      text: "Mohon isi nama Anda dulu ya 🙏",
      icon: "warning",
      confirmButtonColor: "#d4af37",
    });
  }
}

// Musik
function toggleMusic() {
  if (isPlaying) {
    audio.pause();
    musicIcon.classList.add("music-paused");
  } else {
    audio.play();
    musicIcon.classList.remove("music-paused");
  }
  isPlaying = !isPlaying;
}

//Integrasi Buku Tamu
const ucapanForm = document.getElementById("ucapan-form");
if (ucapanForm) {
  ucapanForm.onsubmit = function (e) {
    e.preventDefault();

    const btnKirim = ucapanForm.querySelector('button[type="submit"]');
    const nama = document.getElementById("nama-tamu-form").value;
    const pesan = document.getElementById("pesan").value;
    const kehadiran = document.getElementById("kehadiran").value;
    const feed = document.getElementById("daftar-ucapan");

    if (pesan.trim() === "") {
      Swal.fire({
        title: "Pesan Kosong",
        text: "Mohon isi doa atau ucapan Anda!",
        icon: "error",
        confirmButtonColor: "#d4af37",
      });
      return;
    }

    btnKirim.disabled = true;
    btnKirim.innerText = "Mengirim...";

    fetch(scriptURL, {
      method: "POST",
      body: new FormData(ucapanForm),
    })
      .then((response) => {
        const htmlUcapan = `
                <div class="ucapan-item mb-3 p-3 rounded animate__animated animate__fadeInUp" style="background: rgba(255,255,255,0.05); border-left: 3px solid #d4af37;">
                    <h6 style="color: #d4af37;" class="mb-1">${nama} <small class="text-white-50"> - ${kehadiran}</small></h6>
                    <p class="text-white small mb-0">${pesan}</p>
                </div>
            `;
        feed.insertAdjacentHTML("afterbegin", htmlUcapan);

        ucapanForm.reset();
        document.getElementById("nama-tamu-form").value = nama;
        btnKirim.disabled = false;
        btnKirim.innerText = "Kirim Ucapan";

        // GANTI ALERT SUKSES
        Swal.fire({
          title: "Terima Kasih!",
          text: "Doa Anda sangat berarti bagi kami. 🙏",
          icon: "success",
          confirmButtonColor: "#d4af37",
        });
      })
      .catch((error) => {
        btnKirim.disabled = false;
        btnKirim.innerText = "Kirim Ucapan";
        Swal.fire({
          title: "Gagal!",
          text: "Terjadi kesalahan, coba lagi ya.",
          icon: "error",
          confirmButtonColor: "#d4af37",
        });
      });
  };
}
// ScrollSpy (Menandai Menu yang Aktif)
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section, main, footer");
  const navItems = document.querySelectorAll(".nav-item");
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    if (window.pageYOffset >= sectionTop - 200) {
      current = section.getAttribute("id");
    }
  });

  navItems.forEach((item) => {
    item.style.color = "rgba(255, 255, 255, 0.5)";
    if (current && item.getAttribute("href").includes(current)) {
      item.style.color = "#d4af37";
    }
  });
});

// Logika Countdown
const weddingDate = new Date("February 20, 2026 08:00:00").getTime();
setInterval(function () {
  const now = new Date().getTime();
  const distance = weddingDate - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  if (document.getElementById("days")) {
    document.getElementById("days").innerHTML = days;
    document.getElementById("hours").innerHTML = hours;
    document.getElementById("minutes").innerHTML = minutes;
    document.getElementById("seconds").innerHTML = seconds;
  }
}, 1000);
