ZacEsquilo.Entity = function(tileX, tileY, speed, scale, spriteKey, game){
  this.init(tileX, tileY, speed, scale, spriteKey, game);
}

ZacEsquilo.Entity.prototype = {
  init: function(tileX, tileY, speed, scale, spriteKey, game){
    this.tileX = tileX;
    this.tileY = tileY;
    this.speed = speed;
    this.scale = scale;
    this.initialtileX = tileX;
    this.initialtileY = tileY;
    this.game = game;
    frame = 0;
    // Phaser.Sprite.call(this, game, (tileX * ZacEsquilo.config.tileSize) - ZacEsquilo.config.tileSize / 2, (tileY * ZacEsquilo.config.tileSize) - ZacEsquilo.config.tileSize / 2, spriteKey, frame);
    this.sprite = game.add.sprite((tileX * ZacEsquilo.config.tileSize), (tileY * ZacEsquilo.config.tileSize) - (ZacEsquilo.config.tileSize / 2), spriteKey);
    // this.sprite = game.add.sprite((tileX * ZacEsquilo.config.tileSize) - (ZacEsquilo.config.tileSize / 2), (tileY * ZacEsquilo.config.tileSize) - (ZacEsquilo.config.tileSize / 2), spriteKey);
    this.sprite.scale.setTo(scale);
    this.sprite.anchor.setTo(0.5);

    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.ismoving = false;

    this.game.physics.arcade.enable(this.sprite); // Enabling arcade physics on player sprite
    this.game.physics.arcade.enableBody(this.sprite);
    this.sprite.body.allowGravity = false;
    this.sprite.entity = this;
  },

  abortMovement: function(){
    console.log('para ae doidao!');
    this.ismoving = false;
  },

  move: function(direction){
    // Checar se pode movimentar nessa direcao (pode estar no final do cenario)
    // Se puder mover
    if(this.ismoving){ return; }
    this.ismoving = true;
    switch(direction){
      case 'up':
        this.desiredTileX = this.tileX;
        this.desiredTileY = this.tileY - 1;
        this.desiredX = this.sprite.x;
        this.desiredY = this.sprite.y - ZacEsquilo.config.tileSize;
        // this.movePlayer(0,-1);
        break;

      case 'down':
        this.desiredTileX = this.tileX;
        this.desiredTileY = this.tileY + 1;
        this.desiredX = this.sprite.x;
        this.desiredY = this.sprite.y + ZacEsquilo.config.tileSize;
        // this.movePlayer(0,1);
        break;

      case 'left':
        this.desiredTileX = this.tileX - 1;
        this.desiredTileY = this.tileY;
        this.desiredX = this.sprite.x - ZacEsquilo.config.tileSize;
        this.desiredY = this.sprite.y;
        // this.movePlayer(-1,0);
        break;

      case 'right':
        this.desiredTileX = this.tileX + 1;
        this.desiredTileY = this.tileY;
        this.desiredX = this.sprite.x + ZacEsquilo.config.tileSize;
        this.desiredY = this.sprite.y;
        // this.movePlayer(1,0);
        break;

      default:
        alert('Use as teclas das setas direcionais para movimentar o personagem');
        break;
    }

  },

  movePlayer: function(x, y) {
    // Because we're adding 32 to the player's position, we need to prevent cases where the user tries to move
    // the player mid-move, knocking it off the grid. This is a crude way to do it but it works.
    if (this.isMoving) { return; }
    this.isMoving = true;
    // Tween the player to the next grid space over 250ms, and when done, allow the player to make another move
    game.add.tween(this.sprite).to({
      x: this.sprite.x + x * ZacEsquilo.config.tileSize,
      y: this.sprite.y + y * ZacEsquilo.config.tileSize},
      250,
      Phaser.Easing.Linear.None,
      true
      ).onComplete.add(function(){
        this.isMoving = false;
        this.tileX = this.sprite.x / ZacEsquilo.config.tileSize;
        this.tileY = this.sprite.y / ZacEsquilo.config.tileSize;
      }, this);
  },

  update: function(){
    var incrementX,
        incrementY,
        exceededRight,
        exceededLeft;

    if (this.ismoving){
      // Checar em qual direçao - comparar desiredTile com tile
      if (this.desiredTileY - this.tileY != 0){
        incrementY = this.speed * (this.desiredTileY - this.tileY);
        this.sprite.y += incrementY;
        if (this.sprite.y == this.desiredY){
          this.ismoving = false;
          this.tileY = this.desiredTileY;
        }
      }
      if (this.desiredTileX - this.tileX != 0){
        // quantas unidades andar para a direita (se positivo) ou para esquerda
        // (se negativo)
        incrementX = this.speed * (this.desiredTileX - this.tileX);

        // se a entity está à direita de onde deseja ir
        exceededRight = this.sprite.x >= this.desiredX;

        // se a entity está à esquerda de onde deseja ir
        exceededLeft = this.sprite.x <= this.desiredX;

        // movimenta para a direita ou esquerda
        this.sprite.x += incrementX;

        // se está indo para direita E já passou da hora de parar
        //  OU está indo para esquerda E já passou da hora de parar
        if ((incrementX > 0 && exceededRight) ||
            (incrementX < 0 && exceededLeft)) {
          // interrompe o movimento
          this.ismoving = false;
          this.tileX = this.desiredTileX;
        }
      }
    }
  }
}