//made by Amjad Al Kharusi
//connected both chessboardjs and chess.js

var board = null
var game = new Chess()
var whiteSquareGrey = '#a9a9a9'
var blackSquareGrey = '#696969'

function removeGreySquares() {
  $('#myBoard .square-55d63').css('background', '')
}

function greySquare(square) {
  var $square = $('#myBoard .square-' + square)

  var background = whiteSquareGrey
  if ($square.hasClass('black-3c85d')) {
    background = blackSquareGrey
  }

  $square.css('background', background)
}

function onDragStart(source, piece) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false

  // or if it's not that side's turn
  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
    (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false
  }
}

function onDrop(source, target) {

  removeGreySquares()
  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q'
  })

  // illegal move
  if (move === null) return 'snapback'

  if (checkStatus() == false) {
    function play() {
      var audio = new Audio('sound/placing-sfx.mp3');
      audio.play();
    }
    play()
  }

}

function onMouseoverSquare(square, piece) {
  // get list of possible moves for this square
  var moves = game.moves({
    square: square,
    verbose: true
  })

  // exit if there are no moves available for this square
  if (moves.length === 0) return

  // highlight the square they moused over
  greySquare(square)

  // highlight the possible squares for this piece
  for (var i = 0; i < moves.length; i++) {
    greySquare(moves[i].to)
  }
}

function onMouseoutSquare(square, piece) {
  removeGreySquares()
}

function onSnapEnd() {
  board.position(game.fen())
}

var config = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onMouseoutSquare: onMouseoutSquare,
  onMouseoverSquare: onMouseoverSquare,
  onSnapEnd: onSnapEnd

}
board = Chessboard('myBoard', config)

function checkStatus() {
  if (game.in_checkmate()) {

    $('#status').html(`<b style="Orbitron, sans-serif; color:rgb(248, 85, 50);">Checkmate!</b>
    <button  class="btn btn-primary" onClick="window.location.reload();">play again</button>`).animate({
      "font-size": "3em"
    }, 1000);



    var audio = new Audio('sound/CheckMate-sfx.mp3');
    audio.play();

  } else if (game.insufficient_material()) {
    $('#status').html(`It's a <b>draw!</b> (Insufficient Material)
    <button class="btn btn-primary" onClick="window.location.reload();">play again</button>`).animate({
      "font-size": "3em"
    }, 1000);
    var audio = new Audio('sound/check-sfx.mp3');
    audio.play();



  } else if (game.in_threefold_repetition()) {
    $('#status').html(`It's a <b>draw!</b> (Threefold Repetition)
    <button class="btn btn-primary" onClick="window.location.reload();">play again</button>`).animate({
      "font-size": "3em"
    }, 1000);
    var audio = new Audio('sound/check-sfx.mp3');
    audio.play();



  } else if (game.in_stalemate()) {
    $('#status').html(`It's a <b>draw!</b> (Stalemate)
    <button class="btn btn-primary" onClick="window.location.reload();">play again</button>`).animate({
      "font-size": "3em"
    }, 1000);
    var audio = new Audio('sound/check-sfx.mp3');
    audio.play();



  } else if (game.in_draw()) {
    $('#status').html(`It's a <b>draw!</b> (50-move Rule)
    <button class="btn btn-primary" onClick="window.location.reload();">play again</button>`).animate({
      "font-size": "3em"
    }, 1000);
    var audio = new Audio('sound/check-sfx.mp3');
    audio.play();



  } else if (game.in_check()) {
    $('#status').html(`<b>check!</b>
    `).animate({
      "font-size": "3em",
      left: '250px',
    }, 1000);
    var audio = new Audio('sound/check-sfx.mp3');
    audio.play();

    return false;
  } else {
    $('#status').html(``);
    return false;
  }
  audio.pause();
  return true;
}