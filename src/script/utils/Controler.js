import FormModel from "../models/FormModel";
import CardsModel from "../models/CardsModel";

class Controller {
    constructor() {
        this.formModel = new FormModel();
        this.cardsModel = new CardsModel();
    }

    resetForm(event) {
        const formElement = event.target.closest('.form');
        formElement.findName.value = '';
        formElement.minAge.value = '';
        formElement.maxAge.value = '';
        formElement.gender.value = 'both';
        formElement.sort.value = 'abcAscending';
        this.setDataFromForm(event);
    }

    setDataFromForm(event) {
        const formElement = event.target.closest('.form');
        const formData = {
            name: formElement.findName.value.trim(),
            minAge: +formElement.minAge.value || undefined,
            maxAge: +formElement.maxAge.value || undefined,
            gender: formElement.gender.value,
            sort: formElement.sort.value,
        };

        this.cardsModel.findAndSort(formData);
    }

    onOpenMobileMenu(event) {
        const menuBtn = document.querySelector('.mob_menu');
        document.body.classList.toggle('lock');
        const aside = document.querySelector('.aside');
        aside.classList.toggle('active');
        menuBtn.classList.toggle('active');
    }

    onSubmitForm(event) {
        event.preventDefault();
        this.setDataFromForm(event);
    }

    onClick(event) {
        if (event.target.closest('.form-checkbox')) {
            this.onCheck(event);
        }
        if (event.target.closest('.form-button')) {
            switch (event.target.closest('.form-button').id) {
                case 'submit':
                    if (event.target.closest('.active')) {
                        this.onOpenMobileMenu();
                    }
                    break;
                case 'reset':
                    this.resetForm(event);
                    break;
                default:
                    break;
            }
        }
    }

    onCheck(event) {
        const checkBox = event.target.closest('.form-checkbox');
        this.setDataFromForm(event);
        checkBox.checked = true;
    }

    onInput(event) {
        const input = event.target.closest('.form-input');
        if (input) {
            this.setDataFromForm(event);

        }
    }

    onLoad() {
        this.cardsModel.createUserList();
    }


};

export default Controller