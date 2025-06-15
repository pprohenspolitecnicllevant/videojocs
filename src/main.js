import { gsap } from "gsap";

import { InertiaPlugin } from "gsap/InertiaPlugin";

const el = document.getElementById('countdown');
let prev = { days: null, hours: null, minutes: null, seconds: null };

function renderCountdown({ days, hours, minutes, seconds }) {
    el.innerHTML = `
        <span id="cd-days">${days}d</span> 
        <span id="cd-hours">${hours}h</span> 
        <span id="cd-minutes">${minutes}m</span> 
        <span id="cd-seconds">${seconds}s</span>
    `;
}

function animateUnit(id) {
    const unitEl = document.getElementById(id);
    if (unitEl) {
        gsap.fromTo(unitEl, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power1.out" });
    }
}

function updateCountdown() {
    const target = new Date('2025-06-28T21:00:00');
    const now = new Date();
    const diff = target - now;
    if (diff <= 0) {
        el.textContent = "The GameJam has started!";
        return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    renderCountdown({ days, hours, minutes, seconds });

    if (prev.days !== null && days !== prev.days) animateUnit("cd-days");
    if (prev.hours !== null && hours !== prev.hours) animateUnit("cd-hours");
    if (prev.minutes !== null && minutes !== prev.minutes) animateUnit("cd-minutes");
    if (prev.seconds !== null && seconds !== prev.seconds) animateUnit("cd-seconds");

    prev = { days, hours, minutes, seconds };
}

const contestants = [
    { name: "Josep", img: "https://randomuser.me/api/portraits/men/32.jpg" },
    { name: "Joan", img: "https://randomuser.me/api/portraits/women/44.jpg" },
    { name: "Bazz", img: "https://randomuser.me/api/portraits/men/65.jpg" },
    { name: "Biel", img: "https://randomuser.me/api/portraits/women/68.jpg" },
    { name: "Toni", img: "https://randomuser.me/api/portraits/men/12.jpg" },
    { name: "Jose", img: "https://randomuser.me/api/portraits/women/22.jpg" },
    { name: "Carlos", img: "https://randomuser.me/api/portraits/men/41.jpg" },
    { name: "Andreu", img: "https://randomuser.me/api/portraits/women/50.jpg" }
];

function renderContestants() {
    const grid = document.getElementById('contestants');
    grid.innerHTML = contestants.map((c, i) => `
    <div class="contestant-card flex flex-col items-center bg-[#18003a] rounded-xl p-3 shadow-lg border-2 border-[#00fff7]">
      <img src="${c.img}" alt="${c.name}" class="w-20 h-20 rounded-full border-4 border-[#ff00ea] mb-2"/>
      <span class="text-[#fff] font-bold drop-shadow-[0_0_6px_#00fff7]">${c.name}</span>
    </div>
  `).join('');
}

function animateContestants() {
    gsap.from(".contestant-card", {
        opacity: 0,
        scale: 0.5,
        rotateY: 90,
        duration: 0.8,
        ease: "back.out(1.7)",
        stagger: 0.08
    });
}

function confetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let W = canvas.width;
    let H = canvas.height;

    const confettiColors = ['#00fff7', '#ff00ea', '#fff', '#1a0033'];
    const confettiPieces = Array.from({length: 40}, () => ({
        x: Math.random() * W,
        y: Math.random() * H - H,
        r: Math.random() * 6 + 4,
        d: Math.random() * 80 + 40,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        tilt: Math.random() * 10 - 10,
        tiltAngle: 0,
        tiltAngleIncremental: (Math.random() * 0.07) + 0.05
    }));

    function draw() {
        W = canvas.width;
        H = canvas.height;
        ctx.clearRect(0, 0, W, H);
        confettiPieces.forEach(c => {
            ctx.beginPath();
            ctx.lineWidth = c.r;
            ctx.strokeStyle = c.color;
            ctx.moveTo(c.x + c.tilt + c.r / 3, c.y);
            ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.d / 5);
            ctx.stroke();
        });
        update();
    }

    function update() {
        confettiPieces.forEach(c => {
            c.y += (Math.cos(c.d) + 3 + c.r / 2) / 2;
            c.x += Math.sin(0.01 * c.d);
            c.tiltAngle += c.tiltAngleIncremental;
            c.tilt = Math.sin(c.tiltAngle) * 15;
            if (c.y > H) {
                c.x = Math.random() * W;
                c.y = -10;
            }
        });
    }

    // Throttle to ~30 FPS
    function loop() {
        draw();
        setTimeout(loop, 33);
    }
    loop();
}


// Initial animation for title and theme
window.addEventListener('DOMContentLoaded', () => {
    gsap.from("h1", {duration: 1, y: -60, opacity: 0, ease: "back.out(1.7)"});
    gsap.from("#theme", {duration: 1, x: 80, opacity: 0, delay: 0.5, ease: "power2.out"});
    updateCountdown();
    setInterval(updateCountdown, 1000);

    renderContestants();
    animateContestants();

    gsap.registerPlugin(InertiaPlugin)

    let oldX = 0,
        oldY = 0,
        deltaX = 0,
        deltaY = 0

    const root = document.querySelector('#contestants')
    root.addEventListener("mousemove", (e) => {
        // Calculate horizontal movement since the last mouse position
        deltaX = e.clientX - oldX;

        // Calculate vertical movement since the last mouse position
        deltaY = e.clientY - oldY;

        // Update old coordinates with the current mouse position
        oldX = e.clientX;
        oldY = e.clientY;
    })

    root.querySelectorAll('.contestant-card').forEach(el => {

        // Add an event listener for when the mouse enters each media
        el.addEventListener('mouseenter', () => {

            const tl = gsap.timeline({
                onComplete: () => {
                    tl.kill()
                }
            })
            tl.timeScale(1.2) // Animation will play 20% faster than normal

            const image = el
            tl.to(image, {
                inertia: {
                    x: {
                        velocity: deltaX * 30, // Higher number = movement amplified
                        end: 0 // Go back to the initial position
                    },
                    y: {
                        velocity: deltaY * 30, // Higher number = movement amplified
                        end: 0 // Go back to the initial position
                    },
                },
            })
            tl.fromTo(image, {
                rotate: 0
            }, {
                duration: 0.4,
                rotate:(Math.random() - 0.5) * 30, // Returns a value between -15 & 15
                yoyo: true,
                repeat: 1,
                ease: 'power1.inOut' // Will slow at the begin and the end
            }, '<') // The animation starts at the same time as the previous tween
        })
    })

    confetti();
});