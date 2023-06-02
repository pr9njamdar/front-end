export const logoutfunction=()=>{
 if(localStorage.getItem("CompanyName"))
 {
    return false
 }
 else{
    return true
 }


}