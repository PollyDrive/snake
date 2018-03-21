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
        ctx.fillText(score, 2.5 * box, 1.5 * box);
       
        let scoreApple = new Image();
        scoreApple.src = 'static/img/assets/canvas/cherries.png';
        scoreApple.onload = function () {
            ctx.drawImage(scoreApple, 30, 15, 50, 50);
        };

        // еда
        let apple = new Image();
        apple.src = 'static/img/assets/canvas/cherries.png';
        
        let randomCoord = function () {
            return Math.floor(Math.random() * 16) * box;
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
        // получение цвета ячейки для перерисовки
        function getThePixelData(cellX, cellY, cellSize) {
            let myImageData = ctx.getImageData(cellX, cellY, cellSize, cellSize);
            let data = myImageData.data;
            let rgba = 'rgba(' + data[0] + ', ' + data[1] +
             ', ' + data[2] + ', ' + (data[3] / 255) + ')';
            console.log(rgba);
            ctx.fillStyle = rgba;
            ctx.fillRect(cellX, cellY, cellSize, cellSize);
            
        }

        // создание яблока в пределах шахматки
        function generateBonus(obj, img, snakeHead) {
            if (obj.x < box || obj.x > box * 16) {
                food = {
                    x: randomCoord(),
                    y: randomCoord()
                };
                return;
            } else if (obj.y < topPadding || obj.y > topPadding + box * 16) {
                food = {
                    x: randomCoord(),
                    y: randomCoord()
                };
                return;
            } else if (snakeHead.x === obj.x && snakeHead.y === obj.y) {
                getThePixelData(obj.x, obj.y, box);
                obj = {
                    x: randomCoord(),
                    y: randomCoord()
                };
                
                generateBonus(obj, img, snakeHead);
            } else {
                ctx.drawImage(img, obj.x, obj.y, box, box);
            }
        }
    
        // удаление бонусов 
        function deleteLayer(delX, delY, s) {
            ctx.clearRect(delX, delY, s, s);
        }
    
        // пиздец змейке
        function gameOver() {
            snake.splice(0, snake.length);
            let over = 'GAME OVER';
            ctx.fillStyle = white;
            ctx.font = '42px Arial';
            ctx.fillText(over, 3.5 * box, 1.5 * box);
        }
        
        // перерисовка
        function drawSnakeAndBoard() {
            // шахматка
            ctx.fillStyle = white;
            ctx.fillRect(box, topPadding, 0, 0);
            for (x = 0; x < 16; x++) {
                for (y = 0; y < 16; y++) {
                    if (x % 2 === y % 2) {
                        ctx.fillStyle = greenDark;
                        ctx.fillRect(box + box * x, topPadding + box * y, box, box);
                    } else {
                        ctx.fillStyle = greenLight;
                        ctx.fillRect(box + box * x, topPadding + box * y, box, box);
                    }
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

            generateBonus(food, apple, newHead);

            // добавить новый элемент в начало
            snake.unshift(newHead);

            console.log(food.x);
            // console.log(newHead.x);

            // ограничение размера поля
            if (newHead.y < topPadding || newHead.y > topPadding + box * 16 || newHead.x < box || newHead.x > box * 16) {
                gameOver();
            }

            // + за яблоки
            if (newHead.x === food.x && newHead.y === food.y) {
                // deleteLayer(food.x, food.y, box);
                snake.push(newHead);
                console.log(snake);
                // generateBonus(food, apple);

                // удаления слоя score
                deleteLayer(75, 15, 40);
                ctx.fillStyle = '#399e84';
                ctx.fillRect(75, 15, 40, 40);
                score++;
                ctx.fillStyle = white;
                ctx.font = '42px Arial';
                ctx.fillText(score, 2.5 * box, 1.5 * box);
                
            } else {
                //
            }
        }
        let game = setInterval(drawSnakeAndBoard, 200);
    }
}

