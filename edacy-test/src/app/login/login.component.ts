import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user/user.service';
import { User } from '../models/user';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


    constructor(
        private formBuilder: FormBuilder, private router: Router, private userService: UserService
    ) { }
    addForm: FormGroup;
    model: any = {};
    user: User;
    ngOnInit() {

        this.addForm = this.formBuilder.group({
            login: ['', Validators.required],
            password: ['', Validators.required]
        });

    }

    login() {
        console.log('Tentative de connexion');

        this.userService.authenticate(this.addForm.value)
            .subscribe(data => {
               
                if (data) {
                   this.user = data;
                    localStorage.setItem('user', JSON.stringify(this.user));
                    this.router.navigate(['dashboard']);
                }
            });
    }
}