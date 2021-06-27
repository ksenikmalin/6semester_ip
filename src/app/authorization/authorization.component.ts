import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MainService } from '../shared/services/main.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.css']
})
export class AuthorizationComponent implements OnInit {

  // Логическая переменная, определяющая наличие или отсутсвие сообщения о неправильном логине или пароле
  notExistEmailOrPassword=true;
  // Логическая переменная, определяющая наличие или отсутсвие сообщения о незаполненных обязательных полях
  isEmpty=true;
  form :FormGroup;
  user = {
    id_user: "",
    surname: "",
    name: "",
    patronymic: "",
    number_phone: "",
    email: "",
    password: "",
    role: ""
  }

  constructor(private api: MainService, private router: Router) { }

  ngOnInit() {
    // Инициализация FormGroup, создание FormControl, и назанчение Validators
    this.form = new FormGroup({
      'email': new FormControl('', [Validators.required]),
      'password': new FormControl('', [Validators.required])
    });
  }

  // Функция входа, отправляющая данные, полученные с формы на сервер, и реагирующая на ответ с сервера
  async onEmail() {
   localStorage.clear();
    if ((this.form.value.email=="")||(this.form.value.password=="")) {
      this.isEmpty=false;
    } else
    {
      this.isEmpty=true;
      let infoAboutUser;
    infoAboutUser = {
      email: this.form.value.email,
      password: this.form.value.password,
    }
    console.log(infoAboutUser);
    try {
      let ExistOrNot = await this.api.post(JSON.stringify(infoAboutUser), "/email");
      this.form.reset();
      if (ExistOrNot != "not exist") {
        this.user.id_user = ExistOrNot[0].id_user;
        this.user.surname = ExistOrNot[0].surname;
        this.user.name = ExistOrNot[0].name;
        this.user.patronymic = ExistOrNot[0].patronymic;
        this.user.number_phone = ExistOrNot[0].number_phone;
        this.user.email = ExistOrNot[0].email;
        this.user.password = ExistOrNot[0].password;
        this.user.role = ExistOrNot[0].role;
        console.log(this.user);
        this.notExistEmailOrPassword = true;
        localStorage.setItem("role", this.user.role);
        localStorage.setItem("id_user", this.user.id_user);
        localStorage.setItem('surname', this.user.surname);
        localStorage.setItem('name', this.user.name);
        localStorage.setItem('patronymic', this.user.patronymic);
        localStorage.setItem('number_phone', this.user.number_phone);
        this.router.navigate(['/profile']);


      } else {
        this.notExistEmailOrPassword = false;
        console.log("Неверный логин или пароль");
      }
    } catch (error) {
      console.log(error);
    }
    }

   }

   // Функция, убирает сообщения о неправильном логине или пароле и о незаполненных полях
   onFlag(){
     this.notExistEmailOrPassword=true;
     this.isEmpty=true;
   }

  }


