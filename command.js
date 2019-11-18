const program = require('commander');
const request = require('request');
const url = 'http://fourtytwowords.herokuapp.com/';
const api_key = 'b972c7ca44dda72a5b482052b1f5e13470e01477f3fb97c85d5313b3c112627073481104fec2fb1a0cc9d84c2212474c0cbe7d8e59d7b95c7cb32a1133f778abd1857bf934ba06647fda4f59e878d164';

program
 .version('1.0.0')
 .description('Command Line Tool')

// definition of the given word
program
 .command('defn <word>')
 .action((word) => {
    request(url+ 'word/' + word + '/definitions?api_key=' + api_key, { json: true }, (err, res, body) => {
        console.log(res.body);
        if (err) { return console.log(err); }
    });
 });

// synonyms of the given word
 program
 .command('syn <word>')
 .action((word) => {
    request(url+ 'word/' + word + '/relatedWords?api_key=' + api_key, { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }
        for(var i=0; i< res.body.length; i++) {
            if(res.body[i].relationshipType === 'synonym') {
                console.log(res.body[i].words);
                break;
            }
        }
    });
 });
// antonyms of the given word
 program
 .command('ant <word>')
 .action((word) => {
    request(url+ 'word/' + word + '/relatedWords?api_key=' + api_key, { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }
        for(var i=0; i< res.body.length; i++) {
            if(res.body[i].relationshipType === 'antonym') {
                console.log(res.body[i].words);
                break;
            }
        }
    });
 });
// example sentence of the given word
program
 .command('ex <word>')
 .action((word) => {
    request(url+ 'word/' + word + '/examples?api_key=' + api_key, { json: true }, (err, res, body) => {
        console.log(res.body.examples);
        if (err) { return console.log(err); }
    });
 });
// complete random word details
  program
 .command('random')
 .action((word) => {
    request(url+ 'words/randomWord?api_key=' + api_key, { json: true }, (err, res, body) => {
        console.log(res.body);
        if (err) { return console.log(err); }
    });
 });
// complete word details
 program
 .command('wordcomplete <word>')
 .action((word) => {
    request(url+ 'word/' + word + '/relatedWords?api_key=' + api_key, { json: true }, (err, res, body) => {
        console.log(res.body);
        if (err) { return console.log(err); }
    });
 });
 
// complete random word details
program
 .command('play')
 .action((word) => {
    request(url+ 'words/randomWord?api_key=' + api_key, { json: true }, (err, res, body) => {
        var wordData = {};
        if (err) { return console.log(err); }
        request(url+ 'word/' + res.body.word + '/relatedWords?api_key=' + api_key, { json: true }, (err, res1, body) => {
            console.log(res1.body);
            wordData[res1.body[0].relationshipType] = res1.body[0].words;
            if(res1.body[1])
                wordData[res1.body[1].relationshipType] = res1.body[1].words;
        });
        request(url+ 'word/' + res.body.word + '/definitions?api_key=' + api_key, { json: true }, (err, res2, body) => {
            console.log(res2.body);
            wordData.definitions = res2.body;
        });
        setTimeout(() => {
            if(wordData.definitions[0])
                console.log('definitions', wordData.definitions[0].text)
            if(wordData.antonym)
                console.log('antonym', wordData.antonym[0])
            if(wordData.synonym)
                console.log('synonym', wordData.synonym[0])
            test(wordData, res, 1);
        }, 1000)
    });
 });
 program.parse(process.argv)
 //
 var test = function(wordData, res, i) {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    })
     readline.question(`guess word?`, (userWord) => {
        readline.close()
        if(wordData.synonym.indexOf(userWord) > 0 || userWord === res.body.word) {
            console.log('Correct');
        } else {
            console.log("1) Try again");
            console.log("2) Hint");
            console.log("3) Quit");
            const readline1 = require('readline').createInterface({
                input: process.stdin,
                output: process.stdout
            })
            readline1.question(`your choice?`, (userWord1) => {
                readline1.close()
                if(userWord1 == "3") {
                    console.log("3) Quit \n " + res.body.word) 
                } else if (userWord1 == "2") {
                    var shuffled = res.body.word.split('').sort(function(){return 0.5-Math.random()}).join('');
                    var text = "Shuffled word: " + shuffled;
                    if(wordData.definitions && wordData.definitions[i]) {
                        text += "\n definitions: " + wordData.definitions[i].text;
                    }
                    if(wordData.antonym && wordData.antonym[i]) {
                        text += "\n antonym: " + wordData.antonym[i];
                    }
                    if(wordData.synonym && wordData.synonym[i]) {
                        text += "\n synonym: " + wordData.synonym[i];
                    }
                    console.log("2) Hint \n Hint could be: \n" + text);
                } else {
                    console.log("1) Try again \n Lets try again.");
                    test(wordData, res, i++);
                }
            })
        }
    })
 }
