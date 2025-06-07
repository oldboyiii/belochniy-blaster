const config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 600,
    physics: { default: 'arcade', arcade: { gravity: { y: 0 } } },
    scene: { preload, create, update }
};

const game = new Phaser.Game(config);
let player, cursors, bullets, score = 0, scoreText;

function preload() {
    this.load.image('background', 'assets/forest_bg.png');
    this.load.image('player', 'assets/player.png');
    this.load.image('bullet', 'assets/bullet.png');
    this.load.image('squirrel', 'assets/squirrel.png');
}

function create() {
    this.add.image(400, 300, 'background');
    player = this.physics.add.sprite(400, 500, 'player');
    player.setCollideWorldBounds(true);
    bullets = this.physics.add.group();
    cursors = this.input.keyboard.createCursorKeys();
    this.input.on('pointerdown', shoot, this);
    scoreText = this.add.text(16, 16, 'Очки: 0', { fontSize: '32px', fill: '#fff' });
    this.time.addEvent({ delay: 2000, callback: spawnSquirrel, callbackScope: this, loop: true });
    
    if (window.Telegram.WebApp) {
        window.Telegram.WebApp.expand();
        this.add.text(700, 16, '🔗', { fontSize: '24px', fill: '#fff' })
            .setInteractive()
            .on('pointerdown', () => window.Telegram.WebApp.shareGame("Белочный Бластер"));
    }
}

function update() {
    if (cursors.left.isDown) player.setVelocityX(-200);
    else if (cursors.right.isDown) player.setVelocityX(200);
    else player.setVelocityX(0);
}

function shoot() {
    if (this.time.now > lastFired) {
        const bullet = bullets.create(player.x, player.y - 20, 'bullet');
        bullet.setVelocityY(-300);
        lastFired = this.time.now + 200;
    }
}

function spawnSquirrel() {
    const squirrel = this.physics.add.sprite(Phaser.Math.Between(50, 750), 0, 'squirrel');
    squirrel.setVelocityY(Phaser.Math.Between(50, 150));
    this.physics.add.overlap(bullets, squirrel, (bullet, squirrel) => {
        bullet.destroy();
        squirrel.destroy();
        score += 10;
        scoreText.setText('Очки: ' + score);
    });
}
