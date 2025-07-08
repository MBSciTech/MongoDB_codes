const mg = require('mongoose');
mg.connect('mongodb://localhost:27017/Employees')
.then(()=>console.log('✔ Connection successful'))
.catch((e)=>console.log('❌ Connection failed'+ e))

const sc = new mgSchema({name:String,age:Number,position:String,Salary:Number})
const employees = mg.model('employees',sc);

async function op(){
    var r = []
    await r.push(employees.updateMany({age:25},{salay:50000}));
    await r.push({name:{$reger:/^e/i}});
    console.log(r);
}



