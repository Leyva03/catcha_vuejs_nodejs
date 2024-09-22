
//== Backend =================================================================

const convolutedCryptoProvider = function(seed) {
  return new Promise(function(resolve, reject) {
    resolve({
        boolean: seed % 2 == 0,
        next: () => convolutedCryptoProvider((seed * 13 + 1) % 25)
      });
  });
}

// TODO

// ... Catcha ...
const getBooleanList = (seed) => {
  return new Promise((resolve, reject) => {
    let result = [];
    let r1 = convolutedCryptoProvider(seed)
    r1.then(x=>{
      result.push(x.boolean)
      let r2 = x.next()
      r2.then(x=>{
        result.push(x.boolean)
        let r3 = x.next()
        r3.then(x=>{
          result.push(x.boolean)
          let r4 = x.next()
          r4.then(x=>{
            result.push(x.boolean)
            let r5 = x.next()
            r5.then(x=>{
              result.push(x.boolean)
              let r6 = x.next()
              r6.then(x=>{
                result.push(x.boolean)
                let r7 = x.next()
                r7.then(x=>{
                  result.push(x.boolean)
                  let r8 = x.next()
                  r8.then(x=>{
                    result.push(x.boolean)
                    let r9 = x.next()
                    r9.then(x=>{
                      result.push(x.boolean)
                      resolve(result)
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
  })
}

const Catcha = function(seed){
  this.getImages = function(){
    return new Promise((resolve, reject) => {
      let imatges = [];
      let p = getBooleanList(seed)
      let other = 0
      let cat = 0
      console.log(p)
      p.then(list =>{
        list.forEach(element => {
          if(element){
            cat++
            imatges.push(`img/cat${cat}.png`)
          }
          else{
            other++
            imatges.push(`img/bike${other}.png`)
          }
        })
      })
      .finally(()=>resolve(imatges))
    })
  }
  
  this.checkAnswer = function(checkBooleans){
    return new Promise((resolve, reject) => {
      let p = getBooleanList(seed)
      let count = 0
      p.then(list=>{
        list.forEach((el, index) => {
          if(el == checkBooleans[index]){
            count++
          }

        })
      })
      .finally(() => {
        if (count == 9) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
    })

  }
}

// == Some Tests You May Want To Use =========================================

getBooleanList(7).then(x => console.log(x));


const c = new Catcha(7);
c.getImages().then(x => console.log(x));
c.checkAnswer([ false, false, true, true, 
	false, false, true, true, false ]).then(x => console.log(x));


for (let i = 0; i < 13; i++) {
  new Catcha(i).getImages().then(list => console.log(i + " " + list))
}


//== Web Server ==============================================================

import express from 'express';
import path from 'path';
import cors from 'cors';

const app = express();
const port = 3001;
const __dirname = path.resolve();
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

app.get('/challenge', function(req, res) {

  if (typeof Catcha != "undefined") {
    const challenge = Math.floor(Math.random() * 13);
    const catcha = new Catcha(challenge);

    catcha.getImages().then(images => {
      res.json({ challenge: challenge, images: images });
    });
  } else {
    // Fallback
    res.json({ challenge: 'TODO', images:
      ['img/cat1.png','img/cat1.png','img/bike1.png',
      'img/bike1.png','img/bike1.png','img/bike1.png',
      'img/bike1.png','img/bike1.png','img/bike1.png']
    });
  }
});

app.post('/response/:challenge', function(req, res) {
  const catcha = new Catcha(req.params.challenge);
  const selected = req.body["selected"];

  catcha.checkAnswer(selected)
    .then(boolean => res.end(boolean ? "PASS": "FAIL"));
});

app.listen(port, () => console.log(`Server listening on port ${port}`))
