import {useState} from 'react';
import axios from 'axios'
function Myform(){
    const [username,setusername] = useState('');
    async function fun(e) {
        e.preventDefault()
        try{
            //https://stunning-space-memory-6jjvg65775pc4rgj-5500.app.github.dev/
            await axios.post('/insert', { username: username });
            alert('username '+ username + "saved successfully");    
            setusername('')
        }catch(e){
            alert('Cannot save data ' + e);
        }  
    }

    var s1 = {
        border:'2px solid blue',
        padding : '10px',

    }
    return(
        <>
            <form onSubmit={fun}>
                <div style={{display :'grid'}}>
                <label>username: </label>
                <input
                  style={s1}
                  type='text'
                  required
                  value={username}
                  onChange={(e)=>setusername(e.target.value)}
                />
                </div>
                <input type='submit' value='insert'/>
                <input type='reset'/>
            </form>

        </>
    );
}

export default Myform;