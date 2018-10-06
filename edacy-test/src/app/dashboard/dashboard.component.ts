import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { User } from '../models/user';
import { UserService } from '../services/user/user.service';


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    users: User[];

    constructor(private router: Router, private userService: UserService) { }

    ngOnInit() {
        this.userService.getAll()
            .subscribe(data => {
                this.users = data;
            });
    }

    deleteUser(user: User): void {
        this.userService.delete(user.id)
            .subscribe(data => {
                this.users = this.users.filter(u => u !== user);
            })
    };

    editUser(user: User): void {
        localStorage.removeItem("editUserId");
        localStorage.setItem("editUserId", user.id.toString());
        this.router.navigate(['edit-user']);
    };

    addUser(): void {
        this.router.navigate(['add-user']);
    };

    getLogin() {
        return JSON.parse(localStorage.getItem('user')).firstName;
    };

    logout() {
        console.log('Tentative de déconnexion');

        localStorage.removeItem('user');
        this.router.navigate(['/login']);
    };
    udpatePassword(){
        this.router.navigate(['/update-password']);
    }
}
