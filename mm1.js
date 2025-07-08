//STEP 1 : require mongoose & connect mongodb
const mg = require('mongoose');
mg.connect('mongodb://localhost:27017/nmydb')
.then(()=>console.log('Connection successful'))
.catch((e)=>console.log('Connection failed'+ e))

//STEP 2 : Create Schema
const sc = new mg.Schema({fname:String,lname:String,age:Number, passed:Boolean});

//STEP 3 : Create Model
mg.pluralize(null);
const student = new mg.model('student',sc);

//STEP 4 : CRUD operations using model 
//Insert document
//const s1 = new student({fname:'Rachel',lname:'Green',age:30,passed:true})
//s1.save()

//Insert 
async function idoc(){
    const st = [{fname:'a1',lname:'a2',age:23,passed:false},
        {fname:'b1',lanme:'b2',age:24,passed:true},
        {fname:'c1',lanme:'c2',age:24,passed:true},
        {fname:'d1',lanme:'d2',age:24,passed:true},
        {fname:'e1',lanme:'e2',age:24,passed:true},
    ]
    var res = await student.insertMany(st);
    console.log(res);
}
//idoc();

//update 
async function up1(id, val) {
    try {
        var res = await student.findByIdAndUpdate(id, val, { new: true });
        console.log('update', res);
    } catch (e) {
        console.log('Update failed:', e);
    }
}


// up1('686cc654b54f5599d6b56507',{fname:'update',lname:'last update'})
async function up2(fname, val) {
    try {
        var res = await student.updateOne({fname},val);
        console.log('update', res);
    } catch (e) {
        console.log('Update failed:', e);
    }
}
// up2('a1',{lname:'update test'})
async function up3(col, val) {
    try {
        var res = await student.updateMany(col,val,{upsert:1});
        console.log('update', res);
    } catch (e) {
        console.log('Update failed:', e);
    }
}
// up3({age:18},{fname:'n1',lname:'n2',age:20})

//delete
async function d1(id){
    try {
        var res = await student.findByIdAndDelete(id);
        console.log('delete', res);
    } catch (e) {
        console.log('Delete failed:', e);
    }
}

async function d2(fname){
    try {
        var res = await student.deleteOne({fname});
        console.log('delete', res);
    } catch (e) {
        console.log('Delete failed:', e);
    }
}

async function d3(filter){
    try {
        var res = await student.deleteMany(filter);
        console.log('delete', res);
    } catch (e) {
        console.log('Delete failed:', e);
    }
}

// d1('686cc654b54f5599d6b56507');
// d2('a1')
d3({age:24})