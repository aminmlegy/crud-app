const floatBtn = document.querySelector(".float-btn");
const formBtn = document.querySelector(".form-btn");
const popUp = document.querySelector(".pop-up");
const closePopUp = document.querySelector(".close-pop-up");
const inputFile = document.querySelector('.input-file');
const imgUpload = document.querySelector('.img-upload');
const form = document.querySelector('.body-pop form');
const tbody = document.querySelector('tbody');
const inputSearch = document.querySelector('#search');
const alertCreate = document.querySelector('.create');
const alertDelete = document.querySelector('.delete');
const alertWrong = document.querySelector('.wrong');
let mainArr= JSON.parse(localStorage.getItem("personArr")) ||  [];
let isEdit = false;
let itemId;

floatBtn.addEventListener('click' , ()=>{
    popUp.classList.add('active')
})

closePopUp.addEventListener('click' , ()=>{
    isEdit = false;
    formBtn.textContent = 'submit';
    imgUpload.src='./assets/images/user.png';
    form.reset();
    popUp.classList.remove('active');
})

inputFile.addEventListener('change' , (e)=>{
        let fileReader = new FileReader();
        fileReader.onload = ()=>{
            let imgUrl = fileReader.result
            imgUpload.src = imgUrl
        }
        fileReader.readAsDataURL(inputFile.files[0])
})

form.addEventListener('submit' , (e)=>{
    e.preventDefault()
    const formData = new FormData(e.target);
    const formObj = Object.fromEntries(formData);
    if(formObj.fullname != "" && formObj.email != ""&& formObj.age != ""&& formObj.city != "" && formObj.phone != "" && formObj.position != "" && formObj.salary != "" && formObj.startdate != ""){
        if(isEdit ){
            const item = mainArr.find((item , idx)=>{
                return idx == itemId
            });
            mainArr[itemId] = {id: item.id , ...formObj , file:imgUpload.src}
            formBtn.textContent = 'submit';
            isEdit = false
        }else{
        fillForm(formObj)
        }
    }else{
        showAlert(alertWrong)
    }
        showAlert(alertCreate)
        localStorage.setItem("personArr" , JSON.stringify(mainArr));
        showItems(mainArr);
        imgUpload.src='./assets/images/user.png';
        form.reset();
        closePopUp.click()
})

const fillForm =(formObj)=>{
    const personObj = {id:Date.now(), ...formObj , file:imgUpload.src};
    mainArr.push(personObj);
}

const editForm = (id)=>{
    const item = mainArr.find((item , idx)=>{
        return idx == id
    });
    form.fullname.value = item.fullname;
    form.email.value = item.email;
    form.phone.value = item.phone;
    form.salary.value = item.salary;
    form.position.value = item.position;
    form.city.value = item.city;
    form.startdate.value = item.startdate;
    form.age.value = item.age;
    imgUpload.src= item.file
    itemId = id;
    console.log(item)
    isEdit = true
    formBtn.textContent = 'edit'
    floatBtn.click();
}

const removeItem = (id)=>{
    mainArr = mainArr.filter((item)=>item.id != id);
    localStorage.setItem("personArr" , JSON.stringify(mainArr));
    showItems(mainArr)
    showAlert(alertDelete)
}

inputSearch.addEventListener('input' , ()=>{
    const filterArr = mainArr.filter((item) =>{
        return(
            item.position.toLowerCase().includes(inputSearch.value.toLowerCase())
        )
    });
    showItems(filterArr);
    // tbody.querySelectorAll('tr').forEach((item , index)=>{
    //     let data = item.textContent.toLowerCase();
    //     let inputVal = inputSearch.value.toLowerCase();
    //     item.classList.toggle('hide' , data.indexOf(inputVal) < 0);
    //     item.style.setProperty('--delay' , index / 25 + `s`)
    // })
})  
const showAlert = (alert)=>{
    alert.classList.add('active');
    setTimeout(()=>{
        alert.classList.remove('active');
    },1500)
}
const showItems = (arr)=>{
    tbody.innerHTML="";

    arr.forEach((item , idx)=>{   
        let data =`<tr>
            <td>${idx + 1}</td>
            <td><img src="${item.file}" alt="" width="40" height="40"></td>
            <td>${item.fullname}</td>
            <td>${item.age}</td>
            <td>${item.city}</td>
            <td>${item.position}</td>
            <td>${item.salary}</td>
            <td>${item.startdate}</td>
            <td>${item.email}</td>
            <td>${item.phone}</td>
            <td>
                <span class="edit" onclick="editForm(${idx})"><i class="fa-solid fa-pen-to-square"></i></span>
                <span class="remove" onclick="removeItem(${item.id})"><i class="fa-solid fa-trash-arrow-up"></i></span>
            </td>
        </tr>`
        tbody.innerHTML+=data
    });
    if(arr.length <= 0){
        tbody.innerHTML=`<tr><td class="empty" colspan="11">No data available in table</td></tr>`
    }
}

showItems(mainArr)