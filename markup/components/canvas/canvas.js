export default class Canvas {
    init() {
        this.drawField();
    }
    drawField() {
        let x, y;
        let box = 35,
            topPadding = box * 3,
            greenDark = '#49bb9c',
            greenLight = '#4af3c5',
            white = '#fff',
            purple = '#79297d';


        // вся доска
        const cnvs = document.getElementById('canvas');
        const ctx = cnvs.getContext('2d');
        ctx.fillStyle = '#54dab6';
        ctx.fillRect(0, 0, 630, 700);
        
        

        // верхняя панель
        ctx.fillStyle = '#399e84';
        ctx.fillRect(0, 0, 630, 70);

        // счет на верхней панели
        let score = 0;
        ctx.fillStyle = white;
        ctx.font = '42px Arial';
        ctx.fillText(score, 2.3 * box, 1.5 * box);
        let scoreApple = new Image();
        scoreApple.src = 'static/img/assets/canvas/apple.png';
        scoreApple.onload = function () {
            ctx.drawImage(scoreApple, 10, -7, 90, 90);
        };

        // шахматка
        for (x = 0; x < 16; x++) {
            for (y = 0; y < 16; y++) {
                if (x % 2 === y % 2) {
                    ctx.fillStyle = greenDark;
                    ctx.fillRect(box + (box * x), topPadding + (box * y), box, box);
                } else {
                    ctx.fillStyle = greenLight;
                    ctx.fillRect(box + (box * x), topPadding + ( box * y), box, box);
                }
            }
        }

        // еда
        let apple = new Image();
        apple.src = 'static/img/assets/canvas/apple.png';
        let food = {
            x: Math.floor(Math.random() * 16) * box + (box / 2),
            y: Math.floor(Math.random() * 16) * box + (box / 2)
        };
        apple.onload = function () {
            ctx.drawImage(apple, box + food.x, topPadding + food.y, 70, 70);
        };

        // начало змеи
        let snake = [];
        snake[0] = {x: 9 * box, y: 10 * box};

        // controls
        let d;
        document.addEventListener('keydown', direction);
        function direction(e) {
            if (e.keyCode === 37 && d !== 'right') {
                d = 'left';
            } else if (e.keyCode === 38 && d !== 'down') {
                d = 'up';
            } else if (e.keyCode === 39 && d !== 'left') {
                d = 'right';
            } else if (e.keyCode === 40 && d !== 'up') {
                d = 'down';
            }
        }

        // сама змея, соббсно
        function drawSnake() {
            
            for (let i = 0; i < snake.length; i++) {

                ctx.fillStyle = (i === 0) ? purple : white;
                ctx.fillRect(snake[i].x, snake[i].y, box, box);

                ctx.strokeStyle = greenDark;
                ctx.strokeRect(snake[i].x, snake[i].y, box, box);
            }

            // позиция начала
            let snakeX = snake[0].x;
            let snakeY = snake[0].y;

            // управление
            if (d === 'left') {
                snakeX -= box;
            } else if (d === 'up') {
                snakeY -= box;
            } else if (d === 'down') {
                snakeY += box;
            } else if (d === 'right') {
                snakeX += box; 
            }
            // удалить последний элемент
            // snake.pop();
            
            // новая позиция 
            let newHead = {
                x: snakeX,
                y: snakeY
            };
            // добавить новый элемент в начало
            snake.unshift(newHead);

            if (snakeX === food.x && snakeY === food.y) {
                score++;
                food = {
                    x: Math.floor(Math.random() * 16) * box + (box / 2),
                    y: Math.floor(Math.random() * 16) * box + (box / 2)
                };
            } else {
                // добавить ,не удаляя
            }
        }
        let game = setInterval(drawSnake, 300);
    }
}

