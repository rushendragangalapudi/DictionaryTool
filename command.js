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

 program.parse(process.argv)