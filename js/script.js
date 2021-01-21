const burger = document.querySelector('#burger');
const close = document.querySelector('#close');
const posWrapper = document.querySelector('.pos-wrapper');
const aside = document.querySelector('.aside');
const add = document.querySelector('#add');
//add modal
const modalAdd = document.querySelector('.modal-add');
const modalAddClose = document.querySelector('.modal-add__close');
const btnAddCategory = document.querySelector('#add-category');

const input = document.querySelector('.modal-add__input');
const asideMenu = document.querySelector('.aside__menu');
const delEd = document.querySelector('#delEd');
const clear = document.querySelector('#clear');
//edit modal
const modalEdit = document.querySelector('.modal-edit');
const modalEditClose = document.querySelector('.modal-edit__close');
const btnEditCategory = document.querySelector('#edit-category');
const modalEditInput = document.querySelector('.modal-edit__input');
let categoryBtns = [];
let editId = null;
// menu
burger.addEventListener('click', edAside);
close.addEventListener('click', edAside);
// add Category
add.addEventListener('click', createCategory);
modalAddClose.addEventListener('click', createCategory);
btnAddCategory.addEventListener('click', createCategory);
//удалять изминять кнопки из катигорий
delEd.addEventListener('click', deleteEditBtn);
//очищять катигорию 
clear.addEventListener('click', clearBtns);
//Удалить/изменить кнопку
// modalEditClose
// btnEditCategory
//функции для открывание, закрывание меню слева
function edAside() {
    const atr = this.getAttribute('data-select');

    if (atr === 'burger') {

        funAside(1, 'all', 0, 0, 'none');

        document.body.addEventListener('click', ({
            target
        }) => {
            if (target === posWrapper) {
                funAside(0, 'none', -600, 1, 'all');
                //убираем модальку
                modalAdd.style.opacity = 0;
                modalAdd.style.pointerEvents = 'none';
                input.style.background = 0;
                input.value = '';
            }
        })
    } else {
        funAside(0, 'none', -600, 1, 'all');
    }

}
//функция для изменения стилей
function funAside(opacity, pointerEvents, left, burgerOp, burgerPo) {
    burger.style.opacity = burgerOp;
    burger.style.pointerEvents = burgerPo;

    posWrapper.style.opacity = opacity;
    posWrapper.style.pointerEvents = pointerEvents;

    aside.style.left = left + 'px';
}
//функция для добавлении категории
function createCategory() {
    const atr = this.getAttribute('data-select');

    if (atr === 'add') {

        funAside(1, 'all', -600, 1, 'all');
        modalAdd.style.opacity = 1;
        modalAdd.style.pointerEvents = 'all';

    } else if (atr === 'btn-add') {

        if (input.value === '') {
            return input.style.background = 'rgba(231, 76, 60, .5)';
        }

        input.style.background = 0;

        const date = new Date();
        const obj = {
            name: input.value,
            id: +date,
            active: false,
        }
        localStorage.setItem(+date, JSON.stringify(obj));

        funAside(0, 'none', -600, 1, 'all');
        modalAdd.style.opacity = 0;
        modalAdd.style.pointerEvents = 'none';
        input.value = '';

        addCategory()

    } else {
        funAside(0, 'none', -600, 1, 'all');
        modalAdd.style.opacity = 0;
        modalAdd.style.pointerEvents = 'none';
        input.value = '';
        input.style.background = 0;
    }
    document.body.addEventListener('click', ({
        target
    }) => {
        if (target === posWrapper) {
            funAside(0, 'none', -600, 1, 'all');

        }
    })
}

function addCategory() {
    asideMenu.innerHTML = '';
    categoryBtns = [];
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        if (key === 'activeItem') continue;
        categoryBtns.push(key);
    }
    categoryBtns.forEach(item => {
        const strObj = localStorage.getItem(item);
        const obj = JSON.parse(strObj);
        const asideItemTag = document.createElement('li');
        asideItemTag.className = 'aside__menu-item';
        asideItemTag.id = 'i' + obj.id
        asideItemTag.innerHTML = `<a href="#" class="aside__menu-link">${obj.name}</a>
        <div class="aside__menu-item-btns">
           <div class="aside__menu-item-edit" data-select="edit" title="edit"><i class="fas fa-pen"></i></div>
           <div class="aside__menu-item-delete" data-select="delete" title="delete"><i class="fas fa-times"></i></div>
        </div>`;
        asideMenu.appendChild(asideItemTag)
        deletEditBtnsAdd(asideItemTag)
    });
    const asideMenuItem = document.querySelectorAll('.aside__menu-item');
    asideMenuItem.forEach(item => {
        item.addEventListener('click', ({
            target
        }) => {
            let id = target.closest('.aside__menu-item').id;
            localStorage.setItem('activeItem', id);
            activeMenuLink()
        })
    });

}

function activeMenuLink() {
    const asideMenuLink = document.querySelectorAll('.aside__menu-link');
    const id = localStorage.getItem('activeItem');
    asideMenuLink.forEach(item => item.classList.remove('active'));
    const item = document.querySelector(`#${id} a`);

    if (item === null) return
    else item.classList.add('active');
}

function deletEditBtnsAdd(item) {
    const asideMenuItemEdit = item.querySelector('.aside__menu-item-edit');
    const asideMenuItemDelete = item.querySelector('.aside__menu-item-delete');
    asideMenuItemEdit.addEventListener('click', editCategoryItem);
    asideMenuItemDelete.addEventListener('click', deleteCategoryItem);
}

function deleteEditBtn() {
    const asideMenuItem = document.querySelectorAll('.aside__menu-item');
    asideMenuItem.forEach(item => {
        const asideMenuBtns = item.querySelector('.aside__menu-item-btns');
        asideMenuBtns.classList.toggle('active');
    })
}

function deleteCategoryItem() {
    const item = this.closest('.aside__menu-item');
    const id = item.id.split('').splice(1).join('');
    localStorage.removeItem(id);
    addCategory();
}

function editCategoryItem() {
    // тута
    const item = this.closest('.aside__menu-item');
    const id = item.id.split('').splice(1).join('');
    const strObj = localStorage.getItem(id);
    const obj = JSON.parse(strObj);
    editId = obj.id;
    modalEdit.classList.add('active');
    modalEditInput.value = obj.name;
    funAside(1, 'all', -600, 0, 'none');

    btnEditCategory.addEventListener('click', editItem);
    modalEditClose.addEventListener('click', () => {
        modalEdit.classList.remove('active');
        funAside(0, 'none', -600, 1, 'all');
    });

    document.body.addEventListener('click', ({
        target
    }) => {
        if (target === posWrapper) {
            funAside(0, 'none', -600, 1, 'all');
            //убираем модальку
            modalEdit.classList.remove('active');
            modalEditInput.style.background = 0;
            modalEditInput.value = '';
        }
    })


}

function clearBtns() {
    localStorage.clear();
    addCategory()
}

function editItem() {
    let strObj = localStorage.getItem(editId);
    let obj = JSON.parse(strObj);
    obj.name = modalEditInput.value;
    localStorage.setItem(obj.id, JSON.stringify(obj));

    funAside(0, 'none', -600, 1, 'all');
    //убираем модальку
    modalEdit.classList.remove('active');
    modalEditInput.style.background = 0;
    modalEditInput.value = '';
    addCategory()
}
//функции которые вызываються при загрузки страниц
addCategory()
activeMenuLink()