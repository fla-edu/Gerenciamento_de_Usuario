class UserController {

    constructor(formIDCreate, formIDUpdate, tableID){

        this.formEl = document.getElementById(formIDCreate);
        this.formUpdateEl = document.getElementById(formIDUpdate);
        this.tableEl = document.getElementById(tableID);

        this.onSubmit();
        this.onEdit();
    }

    getValues(formEl){

        let user = {};
        let isValid = true;

        [...formEl.elements].forEach((field, index)=>{

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
            let values = this.getValues(this.formEl);

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
                <button type="button" class="btn btn-primary btn-xs btn-flat btn-edit">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        `;

        this.addEventsTr(tr);

        this.tableEl.appendChild(tr);

        this.updateCount();
    }

    addEventsTr(tr){
        tr.querySelector('.btn-edit').addEventListener('click', e=>{
            let json = JSON.parse(tr.dataset.user);
            let form = document.querySelector("#form-user-update");

            form.dataset.trIndex = tr.sectionRowIndex;

            for(let name in json){
                let field = form.querySelector(`[name=${name.replace("_","")}]`);

                if(field){
                    switch (field.type){
                        case 'file':
                            continue;
                        case 'radio':
                            field = form.querySelector(`[name=${name.replace("_","")}][value=${json[name]}]`);
                            field.checked = true;
                            break;
                        case 'checkbox':
                            field.checked = json[name];
                            break;
                        default:
                            field.value = json[name];
                    }
                }
            }
            this.showPanelUpdate();
        });
    }

    getPhoto(){

        return new Promise((resolve, reject) =>{
            let fileReader = new FileReader();

            let elements = [...this.formEl.elements].filter(item =>{
                if (item.name === 'photo') return item;
            });
    
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

    onEdit(){
        document.querySelector('#box-user-update .btn-cancel').addEventListener('click', e=>{
            this.showPanelCreate();
        });

        this.formUpdateEl.addEventListener("submit", event =>{

            event.preventDefault();

            let btn = this.formUpdateEl.querySelector('[type=submit');
            btn.disabled = true;

            let values = this.getValues(this.formUpdateEl);

            console.log(values);

            let index = this.formUpdateEl.dataset.trIndex;
            let tr = this.tableEl.rows[index];

            tr.dataset.user = JSON.stringify(values);

            tr.innerHTML = `
                <td><img src="${values.photo}" alt="User Image" class="img-circle img-sm"></td>
                <td>${values.name}</td>
                <td>${values.email}</td>
                <td>${(values.admin) ? 'Sim' : 'Não'}</td>
                <td>${Utils.dateFormat(values.register)}</td>
                <td>
                    <button type="button" class="btn btn-primary btn-xs btn-flat btn-edit">Editar</button>
                    <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                </td>
            `;

            this.addEventsTr(tr);
            this.updateCount();
            
        });
    }

    showPanelCreate(){
        document.querySelector('#box-user-create').style.display = 'block';
        document.querySelector('#box-user-update').style.display = 'none';
    }

    showPanelUpdate(){
        document.querySelector('#box-user-create').style.display = 'none';
        document.querySelector('#box-user-update').style.display = 'block';
    }

}