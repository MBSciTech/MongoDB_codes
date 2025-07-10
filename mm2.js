const mg = require('mongoose');
mg.connect('mongodb://localhost:27017/Employees')
.then(()=>console.log('✔ Connection successful'))
.catch((e)=>console.log('❌ Connection failed'+ e))

const sc = new mgSchema({name:String,age:Number,position:String,Salary:Number})
const employees = mg.model('employees',sc);

async function op(){
    var r = []
     r.push(await employees.updateMany({age:25},{salay:50000}));
     r.push(await {name:{$regex:/^e/i}});
    console.log(r);
}



