const INVALID_WORD = 'Esta palavra não está listada';
const INCOMPLETE_WORD = 'Complete a palavra!';
var totalTime;
var activeFocus;
var choosedWord;

newGame();

function newGame() {
    totalTime = 0;
    activeFocus = document.getElementById('first-letter');
    activeFocus.focus();
    choosedWord = chooseWord()
}

setInterval(() => {
    document.getElementById('time').innerHTML = msToMinuts(totalTime += 1000);
}, 1000);

function msToMinuts(ms) {
    min = Math.floor((ms/1000/60) << 0),
    sec = Math.floor((ms/1000) % 60);
    
    return (min < 10 ? '0' + min : min) + ':' + (sec < 10 ? '0' + sec : sec);
}

$('.letter').click((event) => {
    activeFocus.value = event.target.value;
    var next = $(activeFocus).next().length > 0 ? $(activeFocus).next()[0] : $(activeFocus)[0];
    next.focus();
    activeFocus = next;
});

$('.word-input').focus((event) => {
    activeFocus = event.target;
});

$('.clear').click((event) => {
    activeFocus.value = '';
    var prev = $(activeFocus).prev().length > 0 ? $(activeFocus).prev()[0] : $(activeFocus)[0];
    prev.focus();
    activeFocus = prev;
});

$('.enter').click((event) => {
    if(!isRowComplete()) {showAlertModal(INCOMPLETE_WORD); return}

    const word = getWordRow();
    if(!isValidWord(word)) {showAlertModal(INVALID_WORD); return}

    var match = matchLetters(word);
    paintLetters(match.letters, '.active-row');

    if(match.win) { openModalEnd(true); return; }
    if(!activeNextRow()) { openModalEnd(false); return; }
});

function isValidWord(word) {
    return validWords.includes(word);
}

function getWordRow() {
    var word = '';
    var letters = $('.active-row').children();
    for(var letter of letters) {
        word += letter.value;
    }
    return word;
}

function isRowComplete() {
    return getWordRow().length == 5
}

function chooseWord() {
    return validWords[getRandomInt(validWords.length)];
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function matchLetters(word) {
    var match = {win : false, letters: []};
    match.win = choosedWord == word;

    for (let i = 0; i < word.length; i++) {
        var letter = word[i];
        if(letter == choosedWord[i]) {
            match.letters.push({letter : letter, class : 'correct-letter'});
        } else if (choosedWord.includes(letter)) {
            match.letters.push({letter : letter, class : 'partial-correct-letter'});
        } else {
            match.letters.push({letter : letter, class : 'wrong-letter'});
        }
    }
    
    return match;
}

function paintLetters(match, target) {
    var letters = $(target).children();
    for(let i = 0; i < letters.length; i++) {
        $(letters[i]).addClass(match[i].class);
    }
}

function activeNextRow() {
    var nextActive = $('.active-row').next();
    console.log(nextActive);
    if(nextActive.length) {
        $('.active-row').removeClass('active-row');
        nextActive.addClass('active-row');
        nextActive.children()[0].focus();
        return true;
    } else {
        return false;
    }
    
}

function showAlertModal(msg) {
    $("#modal-alert-msg").html(msg);
    $("#modal-alert").css("display", "flex")
    .hide()
    .fadeIn(500)
    .delay(1000)
    .fadeOut(500);
}

function openModalEnd(win) {
    $("#modal-end-result").html(win ? 'Acertou!' : 'Errou!');
    writeLetters(choosedWord);
    $("#modal-end .word-input").addClass('correct-letter');
    $("#modal-end").css("display", "flex")
    .hide()
    .fadeIn(500)
}

function closeModalEnd() {
    $("#modal-end").css("display", "none")
}

function writeLetters(word) {
    var spaces = $("#modal-end .word-input");
    for (let i = 0; i < spaces.length; i++) {
        spaces[i].value = word.charAt(i);
    }
}

$('#modal-end-close').click(() => {
    closeModalEnd();
});

$('#btn-new-game').click(() => {
    $(".word-input").removeClass(['correct-letter', 'partial-correct-letter', 'wrong-letter']);
    $(".word-input").val('');
    newGame();
    closeModalEnd();
});
