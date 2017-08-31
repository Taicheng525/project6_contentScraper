const scrapeIt = require("scrape-it");
const json2csv = require('json2csv');
const fs = require('fs');
let fields = ['title', 'price', 'image','url','time'];
let fieldNames = ['Title', 'Price', 'ImageURL','URL','Time']

let data = new Date();
let list=[];
let year = data.getFullYear();
let month = ("0"+(data.getMonth()+1)).slice(-2);
let day = ("0"+data.getDate()).slice(-2);
let dataDisplay = `${year}-${month}-${day}`;
console.log(dataDisplay);

//create data folder and check if exist or not
if(fs.existsSync("./data")){
    //console.log("Data folder exists");
   }else{
    fs.mkdirSync("./data");
   }

//scrape info from the entry web
try{
scrapeIt("http://www.shirts4mike.com/shirts.php", {
    querySet:{ 
        listItem: ".products li",
        data:{
            shirt_query:{
                selector: 'a',
                attr: 'href'
            }
        }
    }
// getting data from each type of shirt
}).then(querySet => {
    querySet.querySet.forEach(function(item,index){
        scrapeIt(`http://www.shirts4mike.com/${querySet.querySet[index].shirt_query}`,{
            title:{
                selector: "title"
            },
            price:{
                selector: ".price"
            },
            image:{
                selector: ".shirt-picture img",
                attr: "src"
            },
//Push them as an obj into list array          
        }).then((data)=>{
            let obj = {};
            obj.title = data.title;
            obj.price = data.price;
            obj.image = `http://www.shirts4mike.com/${data.image}`;
            obj.url = `http://www.shirts4mike.com/${querySet.querySet[index].shirt_query}`;
            obj.time = dataDisplay;
            list.push(obj);
//creat csv file            
            var csv = json2csv({data: list, fields: fields, fieldNames: fieldNames});
            fs.writeFile(`./data/${dataDisplay}.csv`,csv,function(err){
                if(err){
                    throw err;
                } else{
                    // small problem it actually runs 8 times-------------------------------
                    // file saved 8 times------------------------------
                    //console.log('file.saved')
                }
            });
        });
    });
}).catch(error=>{
    let errormsg =`Couldn't access the website on ${dataDisplay}, please check!`;
    console.error(errormsg);
});
}catch(error){
    console.error(`Wrong URL please try again!`);
}