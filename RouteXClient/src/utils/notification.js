import {  toast } from 'react-toastify';

function notify({ type , message}) {
  console.log("type : ",type ,"message : ",message)
  if(type == "error"){
    console.log("ni tost error")
    toast.error(message)
  }
  if(type == "success"){
    toast.success(message)
  }
  if(type == "warning"){
    toast.warning(message)
  }

}
export default notify;