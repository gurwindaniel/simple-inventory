$(document).ready(function(){

    $('#custclose').on('click',function(){
        $('.modal-body > form').attr('action','/custpost')
        $('#edit_text').empty()
        $('input').css('border','1px solid black')
        $('input').val('')
        $("#custid").prop('disabled',true)
       
    })

    $.ajax({
        url:'/cust',
        method:'get',
        type:'json',
        success:function(data){
            //data table

            var table=$('#datatable').DataTable({
                data:data,
                columns:[
                    {'data':'customer_id','title':'Customer ID'},
                    {'data':'customer_name','title':'Customer Name'},
                    {'data':'age','title':'Age'},
                    {'data':'email','title':'Email'}
                ],
                'columnDefs':[{
                    "targets":0,
                    "className":'dt-body-center',
                    "render":function(data,type,full,meta){
                        return '<input type="checkbox" class="checktable" name="customer_id" value="'+data+'">'
                    }
                }]
            })//data table ends

           table.on('click','tbody tr',function(){
            
            $("#custid").prop('disabled',true)

            $('input').css('border','none')
            const editelement=$('#edit_text')
            if(editelement.children().length<1)
            {
                const edittext=$('<h5></h5>').text('Edit')
                editelement.append(edittext)
                edittext.addClass('text-end')

                edittext.hover(function(){
                    edittext.css({
                        'cursor':'pointer',
                        'color':'red'
                    })
                })

                edittext.mouseleave(function(){
                    edittext.css({
                        'cursor':'default',
                        'color':'black'
                    })
                })

                //edit

                edittext.on('click',function(){
                    $('.modal-body > form').attr('action','/custpatch')
                    $('input').css('border','1px solid black')
                })
            }
            

            const data=table.row(this).data()
            $(this).on('click','td:not(:first-child)',function(){
                $('#exampleModal').modal('toggle')
            })
            
            get_data(data.customer_name,data.age,data.email,data.customer_id)
           })

           //selecting checkbox event
           const arr=[]
           table.on('click','.checktable',function(){
           
            const row=$(this).closest('tr')
            const rowdata=table.row(row).data()
            console.log(rowdata)
            const deletecontainer=$('#deletecontainer')
            if($(this).is(':checked')){
                arr.push(rowdata.customer_id)
                if(deletecontainer.children().length<1)
                {
                    const deletebutton=$('<button></button>').text('Delete').addClass('btn btn-danger')
                    deletecontainer.append(deletebutton)
                }

                //Delete 

                deletecontainer.on('click',function(){
                    if(arr.length==1){
                        
                        $.ajax({
                            url:`/custdelete:${arr[0]}`,
                            method:'delete'
                        })

                    }
                    else{
                       
                        $.ajax({
                            url:`/custdelete:${arr}`,
                            method:'delete'
                        })
                    }
                })
               
            }
            else if(!deletecontainer.prop("checked"))
            {
                const arrindex=arr.indexOf(rowdata.customer_id)
                const ar_removed=arr.splice(arrindex,1)
                if(arr.length==0){
                    deletecontainer.empty()
                }
                
            }

           })

        }
    })

    const fetchdata=()=>{
        const customer={}
       customer.customer_name= $("#customerid").val()
       customer.age=$("#ageid").val()
       customer.email=$("#emailid").val()
       return customer
    }

    const get_data=(customer,age,email,custid)=>{
       
        $('#customerid').val(customer)
      $('#ageid').val(age)
        $('#emailid').val(email)
        $("#custid").val(custid)

        return customer
    }

  $('#custsave').on('click',function(){

    if($('.modal-body > form').attr('action')=='/custpost')
    {
        const data=fetchdata()
   $.ajax({
    url:'/custpost',
    method:'post',
    type:'json',
    data:data,
    success:function(value){
       
    }
   })
    }else if($('.modal-body > form').attr('action')=='/custpatch') {

        const customer={}

   customer.customer_name= $("#customerid").val()
       customer.age=$("#ageid").val()
       customer.email=$("#emailid").val()
       customer.customer_id=$('#custid').val()
        $.ajax({
            url:'/custpatch',
            method:'post',
            type:'json',
            data:customer,
            success:function(value){
               console.log(value)
            }
           })
        
    }
   

  })
    
})