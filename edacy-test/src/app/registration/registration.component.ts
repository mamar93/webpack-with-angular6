import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

import {first} from "rxjs/operators";
import {Router} from "@angular/router";
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,private router: Router, private userService: UserService) { }

  addForm: FormGroup;

  ngOnInit() {

    this.addForm = this.formBuilder.group({
      id: [],
      email: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      login : ['', Validators.required],
      password : ['', Validators.required]
    });

  }

  onSubmit() {
    this.userService.register(this.addForm.value)
      .subscribe( data => {
        this.router.navigate(['dashboard']);
      });
  }

}
