const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const restartButton = document.getElementById('restartButton');

canvas.width = 800;
canvas.height = 600;

let score = 0;
let record = localStorage.getItem('record') || 0;
let misses = 0; // Переменная для отслеживания промахов
const maxMisses = 3; // Максимальное количество промахов

const player = { x: canvas.width / 2, y: canvas.height - 50, radius: 20, color: 'blue', speed: 5, dx: 0 };

const bullets = [];
const targets = [];

// Создаем цели
for (let i = 0; i < 5; i++) {
    targets.push({ x: Math.random() * (canvas.width - 40) + 20, y: Math.random() * 200 + 50, radius: 15, color: 'red' });
}

// Обработка клавиш
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') player.dx = -player.speed;
    if (e.key === 'ArrowRight') player.dx = +player.speed;
    if (e.key === ' ') { // Выстрел
        bullets.push({ x: player.x, y: player.y - player.radius, radius: 5, color: 'white', dy: -10 });
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        player.dx = 0;
    }
});

// Функция для сброса игры
function resetGame() {
    score = 0;
    misses = 0;
    bullets.length = 0;
    targets.length = 0;

    // Создаем цели заново
    for (let i = 0; i < 5; i++) {
        targets.push({ x: Math.random() * (canvas.width - 40) + 20, y: Math.random() * 200 + 50, radius: 15, color: 'red' });
    }

    restartButton.style.display = 'none'; // Скрываем кнопку перезапуска
    gameLoop(); // Запускаем игровой цикл
}

// Обновление и рисование игры
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Проверка на проигрыш
    if (misses >= maxMisses) {
        ctx.fillStyle = 'red';
        ctx.font = '40px Arial';
        ctx.fillText('Игра окончена!', canvas.width / 2 - 100, canvas.height / 2);
        ctx.fillText(`Ваш счет: ${score}`, canvas.width / 2 - 100, canvas.height / 2 + 50);
        restartButton.style.display = 'block'; // Показываем кнопку перезапуска
        return; // Завершаем игру
    }

    // Обновляем позицию игрока
    player.x += player.dx;
    if (player.x - player.radius < 0) player.x = player.radius;
    if (player.x + player.radius > canvas.width) player.x = canvas.width - player.radius;

    // Рисуем игрока
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = player.color;
    ctx.fill();

    // Обновляем и рисуем пули
    for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.y += b.dy;
        if (b.y + b.radius < 0) {
            bullets.splice(i, 1);
            misses++; // Увеличиваем счетчик промахов
            continue;
        }
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.fill();

        // Проверка столкновений с целями
        for (let j = targets.length - 1; j >= 0; j--) {
            const t = targets[j];
            const dx = b.x - t.x;
            const dy = b.y - t.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < b.radius + t.radius) {
                // Попадание
                targets.splice(j, 1);
                bullets.splice(i, 1);
                score++;
                // Создаем новую цель
                targets.push({
                    x: Math.random() * (canvas.width - 40) + 20,
                    y: Math.random() * 200 + 50,
                    radius: 15,
                    color: 'red'
                });
                break;
            }
        }
    }

    // Обновляем и рисуем цели
    for (const t of targets) {
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
        ctx.fillStyle = t.color;
        ctx.fill();
    }

    // Отображение счета и рекорда
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Счет: ${score}`, 10, 30);
    ctx.fillText(`Рекорд: ${record}`, 10, 60);
    ctx.fillText(`Промахи: ${misses}`, 10, 90); // Отображаем количество промахов

    // Обновляем рекорд
    if (score > record) {
        record = score;
        localStorage.setItem('record', record);
    }

    requestAnimationFrame(gameLoop);
}

// Обработчик события для кнопки перезапуска
restartButton.addEventListener('click', resetGame);

// Запуск игры
gameLoop();
