class UserController {

    constructor(formID, tableID){

        this.formEl = document.getElementById(formID);
        this.tableEl = document.getElementById(tableID);

        this.onSubmit();
    }

    getValues(){

        let user = {};
        let isValid = true;

        [...this.formEl.elements].forEach((field, index)=>{

            if(['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value){
                field.parentElement.classList.add('has-error');
                isValid = false;
            }
    
            if(field.name == 'gender' && field.checked){
                user[field.name] = field.value;
            }else if(field.name == 'admin'){
                user[field.name] = field.checked;
            }else{
                user[field.name] = field.value;
            }
            
        });
    
        if(!isValid) return false;

        return new User(
            user.name, 
            user.gender, 
            user.birth,
            user.country,
            user.email,
            user.password,
            user.photo,
            user.admin
        );

    }

    onSubmit(){

        this.formEl.addEventListener('submit', event =>{

            event.preventDefault();

            let btn = this.formEl.querySelector('[type=submit')
            let values = this.getValues();

            if(!values) return false;

            btn.disabled = true;

            this.getPhoto().then(
                (content) =>{
                    values.photo = content;

                    this.addLine(values);

                    this.formEl.reset();

                    btn.disabled = false;
                },
                (e) =>{
                    console.error(e);
                }
            );

        });

    }

    addLine(dataUser){

        let tr = document.createElement('tr');

        tr.dataset.user = JSON.stringify(dataUser);
        
        tr.innerHTML = `
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin) ? 'Sim' : 'Não'}</td>
            <td>${Utils.dateFormat(dataUser.register)}</td>
            <td>
                <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        `;
        this.tableEl.appendChild(tr);

        this.updateCount();
    }

    getPhoto(){

        return new Promise((resolve, reject) =>{
            let fileReader = new FileReader();

            let elements = [...this.formEl.elements].filter(item =>{
                if (item.name === 'photo') return item;
            })
    
            let file = elements[0].files[0];
    
            fileReader.onload = ()=>{
                resolve(fileReader.result);
            };
    
            fileReader.onerror = (e) =>{
                reject(e);
            };

            if (file) fileReader.readAsDataURL(file);
            else resolve('dist/img/boxed-bg.jpg');             
            
        });
        
    }

    updateCount(){

        let numberUsers = 0;
        let numberAdmin = 0;

        [...this.tableEl.children].forEach(tr=>{
            
            numberUsers++;

            let user = JSON.parse(tr.dataset.user);

            if(user._admin) numberAdmin++;
        });

        document.querySelector('#number-users').innerHTML = numberUsers;
        document.querySelector('#number-users-admin').innerHTML = numberAdmin;

    }

}