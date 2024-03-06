$(document).ready(function(){

    $('#userid').prop('disabled',true)
    const userfetch=()=>{
        const user={}
        user.name=$("#nameid").val()
        user.email=$("#emailuserid").val()
        user.role_name=$("#role_nameid").val()
        user.password=$('#passwordid').val()
        return user
    }

$("#usersave").on('click',function(){
  const uservalue=userfetch()
console.log(uservalue)
  const regx=/^([a-z\d]+)@([a-z]+)\.([a-z]{2,8})$/gm

  if(uservalue.name=='' || uservalue.email=='' || uservalue.password=='')
  {
    alert("all fields required")
  }else if(!regx.test(uservalue.email))
  {
    alert('email should be email@val.com')
  }else{
    alert("post message")
    $.ajax({
        url:'/userpost',
        method:'post',
        data:uservalue,
        success:function(value){
            console.log(value)
        }
    })
  }

})


})