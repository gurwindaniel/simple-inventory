$(document).ready(function(){
    const loginpost=()=>{
        const loginval={}

        loginval.email=$('#emailuserid').val()
        loginval.password=$('#passwordid').val()
        return loginval
    }

    $('#postuser').on('click',function(){
       const val=loginpost()
       console.log(val)
    })
})