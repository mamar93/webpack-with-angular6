import { Component, OnInit, Input } from '@angular/core';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";
import { User } from '../models/user';
import { UserService } from '../services/user/user.service';
var sha256 = require("sha256");
@Component({
    selector: 'app-update-password',
    templateUrl: './update-password.component.html',
    styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent implements OnInit {

    user: User;
    @Input() oldpassword: string;
    @Input() newpassword: string;
    constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService) { }

    ngOnInit() {
        let userId = localStorage.getItem("user");
        if (!userId) {
            this.router.navigate(['dashboard']);
            return;
        }
        this.user = JSON.parse(localStorage.getItem('user'));


    }

    onSubmit() {
       
        if (this.user.password == sha256(this.oldpassword)) {
          
            if (this.newpassword.trim().length != 0) {
                
                console.log(this.user.id);
                this.user.password = sha256(this.newpassword);
                this.userService.update(this.user)
                    .subscribe(data => {
                        this.router.navigate(['dashboard']);
                    });
            }
        }
        else{
            console.log("not auth");
        }
    }

}
