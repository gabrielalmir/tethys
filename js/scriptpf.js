let photo = document.getElementById('imgPhoto');
let file = document.getElementById('fImage');

photo.addEventListener('click', () => {
    file.click();
})

file.addEventListener('change', (event) => {

  if (file.files.length <= 0){
    return;
  }  
    
    let reader = new FileReader();

    reader.onload = () =>{
        photo.src = reader.result;
    }

    reader.readAsDataURL(file.files[0]);

});
