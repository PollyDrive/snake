export default class Canvas {
    init() {
        this.drawGame();
    }
    drawGame() {
        let x, y;
        let box = 35,
            topPadding = box * 3,
            greenDark = '#49bb9c',
            greenLight = '#4af3c5',
            white = '#fff',
            purple = '#79297d',
            size = 30;

        // статика:
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

        // еда
        let apple = new Image();
        apple.src = 'static/img/assets/canvas/apple.png';
        
        let randomCoord = function () {
            return Math.floor(Math.random() * 16 * box);
        };
        let food = {
            x: randomCoord(),
            y: randomCoord()
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
            } else if (e.keyCode === 32) {
                d = 'stop';
            }
        }
       
        // перерисовка
        function drawSnakeAndBoard() {
            // размер только шахматки
            ctx.fillStyle = 'transparent';
            ctx.fillRect(box, box * 3, 560, 560);
            // шахматка
            for (x = 0; x < 16; x++) {
                for (y = 0; y < 16; y++) {
                    if (x % 2 === y % 2) {
                        ctx.fillStyle = greenDark;
                        ctx.fillRect(box + box * x, topPadding + box * y, box, box);
                    } else {
                        ctx.fillStyle = greenLight;
                        ctx.fillRect(box + box * x, topPadding + box * y, box, box);
                    }
                    generateBonus(food, apple);
                }
            }
            for (let i = 0; i < snake.length; i++) {
                ctx.fillStyle = (i === 0) ? purple : white;
                ctx.fillRect(snake[i].x, snake[i].y, box, box);
                ctx.strokeStyle = greenDark;
                ctx.strokeRect(snake[i].x, snake[i].y, box, box);
            }
            
            // позиция начала
            let snakeX = snake[0].x;
            let snakeY = snake[0].y;

            // удалить последний элемент
            snake.pop();
            // управление
            if (d === 'left') {
                snakeX -= box;
            } else if (d === 'up') {
                snakeY -= box;
            } else if (d === 'down') {
                snakeY += box;
            } else if (d === 'right') {
                snakeX += box; 
            } else if (d === 'stop') {
                snake.splice(0, snake.length);
            }
            // новая позиция 
            let newHead = {
                x: snakeX,
                y: snakeY
            };
            // добавить новый элемент в начало
            snake.unshift(newHead);

            console.log(food.x);
            console.log(newHead.x);

            // создание яблока в пределах шахматки
            function generateBonus(obj, img) {
                if (obj.x < box * 2 || obj.x > box * 16) {
                    obj.x = randomCoord();
                    ctx.drawImage(img, obj.x, obj.y, 35, 35);
                } else if (obj.y < topPadding || obj.y > box * 16) {
                    obj.y = randomCoord();
                } else {
                    ctx.drawImage(img, obj.x, obj.y, 35, 35);
                }
            }

            // удаление бонусов 
            function deleteLayer(delX, delY, s) {
                ctx.fillStyle = 'transparent';
                ctx.clearRect(delX, delY, s, s);
            }

            // пиздец змейке
            function gameOver() {
                snake.splice(1, snake.length);
                let over = 'GAME OVER';
                ctx.fillStyle = white;
                ctx.font = '42px Arial';
                ctx.fillText(over, 3.5 * box, 1.5 * box);
            }

            // ограничение размера поля
            if (newHead.y < topPadding || newHead.y > box * 16 || newHead.x < box || newHead.x > box * 16) {
                gameOver();
            }

            // + за яблоки
            if (newHead.x === food.x && newHead.y === food.y) {
                deleteLayer(food.x, food.y, size);
                snake.push(newHead);
                generateBonus(food, apple);
                ctx.fillStyle = greenDark;
                deleteLayer(75, 15, 40);
                score++;
                ctx.fillStyle = white;
                ctx.font = '42px Arial';
                ctx.fillText(score, 2.3 * box, 1.5 * box);
                
            } else {
                //
            }
        }
        let game = setInterval(drawSnakeAndBoard, 200);
    }
}

